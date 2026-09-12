import { useEffect, useState, type ReactNode } from "react";
import {
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { demoTagRead, isDemoTag, normalizeTagId, parseNfcUrl, type TagRead } from "./src/protocol";

type Screen = "artist" | "collector" | "home";
type ArtistStep = "identity" | "metadata" | "review";
type WorldStatus = "not-started" | "sandbox-complete";

type ArtworkDraft = {
  description: string;
  medium: string;
  title: string;
  year: string;
};

const initialArtwork: ArtworkDraft = {
  description: "A short description that will become signed artwork metadata.",
  medium: "Archival pigment print",
  title: "Untitled field study",
  year: "2026",
};

function getBrowserRead(): TagRead | null {
  if (Platform.OS !== "web" || typeof window === "undefined") {
    return null;
  }

  return parseNfcUrl(window.location.href);
}

export default function App() {
  const [initialRead] = useState<TagRead | null>(getBrowserRead);
  const [screen, setScreen] = useState<Screen>(initialRead ? "collector" : "home");
  const [artistStep, setArtistStep] = useState<ArtistStep>("identity");
  const [worldStatus, setWorldStatus] = useState<WorldStatus>("not-started");
  const [tagId, setTagId] = useState(initialRead?.tagId ?? demoTagRead.tagId);
  const [counter, setCounter] = useState(initialRead?.counter ?? demoTagRead.counter);
  const [artwork, setArtwork] = useState<ArtworkDraft>(initialArtwork);
  const [localDraftPrepared, setLocalDraftPrepared] = useState(false);
  const [collectorRead, setCollectorRead] = useState<TagRead | null>(initialRead);

  useEffect(() => {
    let active = true;

    void Linking.getInitialURL().then((url) => {
      const read = parseNfcUrl(url);
      if (active && read) {
        openIncomingRead(read);
      }
    });

    const subscription = Linking.addEventListener("url", ({ url }) => {
      const read = parseNfcUrl(url);
      if (read) {
        openIncomingRead(read);
      }
    });

    function openIncomingRead(read: TagRead) {
      setTagId(read.tagId);
      setCounter(read.counter);
      setCollectorRead(read);
      setScreen("collector");
    }

    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  const normalizedTagId = normalizeTagId(tagId);
  const enteredRead: TagRead | null = /^\d+$/.test(counter)
    ? { counter, tagId: normalizedTagId }
    : null;
  const canPrepareDraft =
    worldStatus === "sandbox-complete" &&
    normalizedTagId.length > 0 &&
    artwork.title.trim().length > 0;

  function updateArtwork<Key extends keyof ArtworkDraft>(key: Key, value: ArtworkDraft[Key]) {
    setArtwork((current) => ({ ...current, [key]: value }));
  }

  function inspectRead() {
    setCollectorRead(enteredRead);
    setScreen("collector");
  }

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.shell}>
          <Header screen={screen} onNavigate={setScreen} />
          {screen === "home" ? <Home onNavigate={setScreen} /> : null}
          {screen === "artist" ? (
            <ArtistActivation
              artwork={artwork}
              canPrepareDraft={canPrepareDraft}
              localDraftPrepared={localDraftPrepared}
              onArtworkChange={updateArtwork}
              onPrepareDraft={() => setLocalDraftPrepared(true)}
              onStartWorld={() => setWorldStatus("sandbox-complete")}
              onStepChange={setArtistStep}
              onTagIdChange={setTagId}
              step={artistStep}
              tagId={tagId}
              worldStatus={worldStatus}
            />
          ) : null}
          {screen === "collector" ? (
            <CollectorVerification
              counter={counter}
              onCounterChange={setCounter}
              onInspect={inspectRead}
              onTagIdChange={setTagId}
              read={collectorRead}
              tagId={tagId}
            />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Header({ onNavigate, screen }: { onNavigate: (screen: Screen) => void; screen: Screen }) {
  return (
    <View style={styles.header}>
      <Pressable accessibilityRole="button" onPress={() => onNavigate("home")}>
        <Text style={styles.wordmark}>HumanArt</Text>
      </Pressable>
      <View style={styles.headerActions}>
        <NavButton
          active={screen === "artist"}
          label="Artist"
          onPress={() => onNavigate("artist")}
        />
        <NavButton
          active={screen === "collector"}
          label="Verify"
          onPress={() => onNavigate("collector")}
        />
      </View>
    </View>
  );
}

function NavButton({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.navButton,
        active && styles.navButtonActive,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.navButtonText, active && styles.navButtonTextActive]}>{label}</Text>
    </Pressable>
  );
}

function Home({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  return (
    <View>
      <View style={styles.hero}>
        <View style={styles.heroMarker} />
        <Text style={styles.eyebrow}>Physical art / durable evidence</Text>
        <Text style={styles.heroTitle}>Matter. Memory. Evidence.</Text>
        <Text style={styles.heroCopy}>
          HumanArt guides an artist through associating a prepared NFC DNA 424 tag with
          artist-approved artwork metadata, then makes each piece of evidence legible to anyone who
          scans the work.
        </Text>
        <View style={styles.actions}>
          <PrimaryButton label="Activate a tag" onPress={() => onNavigate("artist")} />
          <SecondaryButton label="Try verification" onPress={() => onNavigate("collector")} />
        </View>
      </View>
      <PrototypeBoundary />
      <View style={styles.featureGrid}>
        <Feature
          index="01"
          title="A guided first step"
          copy="World ID enrollment and wallet control remain separate evidence, but the final experience keeps both steps clear for non-technical artists."
        />
        <Feature
          index="02"
          title="The tag opens the experience"
          copy="A phone opens the NFC tag URL. HumanArt reads its public identifier and counter; a confidential verifier will later validate the encrypted message."
        />
        <Feature
          index="03"
          title="Claims stay separate"
          copy="Tag validation, metadata integrity and artist identity receive distinct statuses. The app never turns partial evidence into an unsupported authenticity badge."
        />
      </View>
    </View>
  );
}

function PrototypeBoundary() {
  return (
    <View style={styles.note}>
      <Text style={styles.noteLabel}>Prototype boundary</Text>
      <Text style={styles.noteCopy}>
        This interface currently uses local sandbox state. It does not verify a World credential,
        control a wallet, decrypt a tag message, or submit an on-chain transaction.
      </Text>
    </View>
  );
}

function Feature({ copy, index, title }: { copy: string; index: string; title: string }) {
  return (
    <View style={styles.feature}>
      <Text style={styles.featureIndex}>{index}</Text>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureCopy}>{copy}</Text>
    </View>
  );
}

function ArtistActivation({
  artwork,
  canPrepareDraft,
  localDraftPrepared,
  onArtworkChange,
  onPrepareDraft,
  onStartWorld,
  onStepChange,
  onTagIdChange,
  step,
  tagId,
  worldStatus,
}: {
  artwork: ArtworkDraft;
  canPrepareDraft: boolean;
  localDraftPrepared: boolean;
  onArtworkChange: <Key extends keyof ArtworkDraft>(key: Key, value: ArtworkDraft[Key]) => void;
  onPrepareDraft: () => void;
  onStartWorld: () => void;
  onStepChange: (step: ArtistStep) => void;
  onTagIdChange: (value: string) => void;
  step: ArtistStep;
  tagId: string;
  worldStatus: WorldStatus;
}) {
  const nextStep = step === "identity" ? "metadata" : "review";
  const previousStep = step === "review" ? "metadata" : "identity";

  return (
    <View style={styles.journey}>
      <Text style={styles.eyebrow}>Artist activation</Text>
      <Text style={styles.pageTitle}>Create the record around the work.</Text>
      <Text style={styles.pageIntro}>
        The tag arrives registered. The artist activates its relationship with a work through a
        short, guided sequence.
      </Text>
      <StepRail step={step} />

      {step === "identity" ? (
        <View style={styles.twoColumn}>
          <View style={styles.panel}>
            <Text style={styles.panelNumber}>Step 1</Text>
            <Text style={styles.panelTitle}>Prove this is a returning human.</Text>
            <Text style={styles.panelCopy}>
              World ID is used once during enrollment. The production path will bind its verified
              output to a wallet authorization, without exposing a public person identifier.
            </Text>
            <EvidenceLine
              label="World ID"
              status={
                worldStatus === "sandbox-complete" ? "Sandbox interaction completed" : "Not started"
              }
              tone={worldStatus === "sandbox-complete" ? "caution" : "neutral"}
            />
            <EvidenceLine label="Wallet authorization" status="Not connected" tone="neutral" />
            <PrimaryButton
              label={
                worldStatus === "sandbox-complete" ? "Sandbox completed" : "Run World sandbox step"
              }
              onPress={onStartWorld}
            />
            <Text style={styles.finePrint}>
              This button changes local prototype state only. It is not a World proof, a wallet
              signature, or an on-chain artist enrollment.
            </Text>
          </View>
          <Aside title="Human credential and consent are different.">
            World ID supports the human-credential policy. A wallet signature will approve the exact
            metadata and tag association. Neither claim replaces the other.
          </Aside>
        </View>
      ) : null}

      {step === "metadata" ? (
        <View style={styles.twoColumn}>
          <View style={styles.panel}>
            <Text style={styles.panelNumber}>Step 2</Text>
            <Text style={styles.panelTitle}>Describe the work in human terms.</Text>
            <Text style={styles.panelCopy}>
              The final system will canonicalize and hash this data before the artist signs it. This
              screen collects a local draft only.
            </Text>
            <Field label="Prepared tag ID">
              <TextInput
                accessibilityLabel="Prepared tag ID"
                autoCapitalize="characters"
                onChangeText={onTagIdChange}
                style={styles.input}
                value={tagId}
              />
            </Field>
            <Field label="Artwork title">
              <TextInput
                accessibilityLabel="Artwork title"
                onChangeText={(value) => onArtworkChange("title", value)}
                style={styles.input}
                value={artwork.title}
              />
            </Field>
            <View style={styles.fieldRow}>
              <View style={styles.fieldHalf}>
                <Field label="Medium">
                  <TextInput
                    accessibilityLabel="Medium"
                    onChangeText={(value) => onArtworkChange("medium", value)}
                    style={styles.input}
                    value={artwork.medium}
                  />
                </Field>
              </View>
              <View style={styles.fieldHalf}>
                <Field label="Year">
                  <TextInput
                    accessibilityLabel="Year"
                    inputMode="numeric"
                    onChangeText={(value) => onArtworkChange("year", value)}
                    style={styles.input}
                    value={artwork.year}
                  />
                </Field>
              </View>
            </View>
            <Field label="Description">
              <TextInput
                accessibilityLabel="Description"
                multiline
                onChangeText={(value) => onArtworkChange("description", value)}
                style={[styles.input, styles.textarea]}
                value={artwork.description}
              />
            </Field>
          </View>
          <MetadataPreview artwork={artwork} tagId={normalizeTagId(tagId)} />
        </View>
      ) : null}

      {step === "review" ? (
        <View style={styles.twoColumn}>
          <View style={styles.panel}>
            <Text style={styles.panelNumber}>Step 3</Text>
            <Text style={styles.panelTitle}>Prepare, then sign and publish.</Text>
            <Text style={styles.panelCopy}>
              This prototype creates only a local preview. The real publication requires a tag
              allocation check, a current World enrollment, a wallet signature and an on-chain
              transaction.
            </Text>
            <EvidenceLine label="Tag allocation" status="No registry connected" tone="neutral" />
            <EvidenceLine label="Metadata signature" status="No wallet connected" tone="neutral" />
            <EvidenceLine label="On-chain revision" status="Not created" tone="neutral" />
            <PrimaryButton
              disabled={!canPrepareDraft}
              label="Prepare local publication draft"
              onPress={onPrepareDraft}
            />
            {localDraftPrepared ? (
              <View style={styles.localNotice}>
                <Text style={styles.localNoticeTitle}>Local draft prepared</Text>
                <Text style={styles.localNoticeCopy}>
                  No secret, World proof, signature, tag validation or blockchain record has been
                  created by this action.
                </Text>
              </View>
            ) : null}
          </View>
          <MetadataPreview artwork={artwork} tagId={normalizeTagId(tagId)} />
        </View>
      ) : null}

      <View style={styles.journeyFooter}>
        {step === "identity" ? (
          <View />
        ) : (
          <SecondaryButton label="Back" onPress={() => onStepChange(previousStep)} />
        )}
        {step === "review" ? null : (
          <PrimaryButton
            disabled={step === "identity" && worldStatus !== "sandbox-complete"}
            label="Continue"
            onPress={() => onStepChange(nextStep)}
          />
        )}
      </View>
    </View>
  );
}

function StepRail({ step }: { step: ArtistStep }) {
  const steps: ArtistStep[] = ["identity", "metadata", "review"];
  const currentIndex = steps.indexOf(step);
  return (
    <View style={styles.stepRail}>
      {steps.map((item, index) => (
        <View key={item} style={styles.stepItem}>
          <View style={[styles.stepDot, index <= currentIndex && styles.stepDotActive]}>
            <Text style={[styles.stepDotText, index <= currentIndex && styles.stepDotTextActive]}>
              {index + 1}
            </Text>
          </View>
          <Text style={[styles.stepLabel, index === currentIndex && styles.stepLabelActive]}>
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

function MetadataPreview({ artwork, tagId }: { artwork: ArtworkDraft; tagId: string }) {
  return (
    <Aside title={artwork.title || "Untitled work"} kicker="Metadata preview">
      <Text style={styles.previewMeta}>
        {artwork.medium || "Medium not set"} / {artwork.year || "Year not set"}
      </Text>
      <View style={styles.previewRule} />
      <Text style={styles.asideCopy}>{artwork.description || "No description yet."}</Text>
      <Text style={styles.previewTagLabel}>Prepared tag</Text>
      <Text style={styles.previewTag}>{tagId || "Not set"}</Text>
      <Text style={styles.finePrint}>
        Preview only. Canonical serialization, hashing and signing are deliberately not simulated
        here.
      </Text>
    </Aside>
  );
}

function Aside({
  children,
  kicker = "Why this matters",
  title,
}: {
  children: ReactNode;
  kicker?: string;
  title: string;
}) {
  return (
    <View style={styles.aside}>
      <Text style={styles.asideKicker}>{kicker}</Text>
      <Text style={styles.asideTitle}>{title}</Text>
      {children}
    </View>
  );
}

function CollectorVerification({
  counter,
  onCounterChange,
  onInspect,
  onTagIdChange,
  read,
  tagId,
}: {
  counter: string;
  onCounterChange: (value: string) => void;
  onInspect: () => void;
  onTagIdChange: (value: string) => void;
  read: TagRead | null;
  tagId: string;
}) {
  const demoMatch = read ? isDemoTag(read) : false;
  return (
    <View style={styles.journey}>
      <Text style={styles.eyebrow}>Collector verification</Text>
      <Text style={styles.pageTitle}>Read the evidence, not a marketing badge.</Text>
      <Text style={styles.pageIntro}>
        Scanning a physical NFC tag normally opens a URL like this page. For the prototype, paste
        the tag identifier and counter to inspect the rendering states.
      </Text>
      <View style={styles.twoColumn}>
        <View style={styles.panel}>
          <Text style={styles.panelNumber}>Tag input</Text>
          <Text style={styles.panelTitle}>What a browser can receive.</Text>
          <Text style={styles.panelCopy}>
            The browser receives public URL parameters. It does not decrypt the DNA 424 message or
            decide authenticity; that belongs to the confidential verifier and on-chain registry.
          </Text>
          <Field label="Tag ID">
            <TextInput
              accessibilityLabel="Tag ID"
              autoCapitalize="characters"
              onChangeText={onTagIdChange}
              style={styles.input}
              value={tagId}
            />
          </Field>
          <Field label="Counter">
            <TextInput
              accessibilityLabel="Counter"
              inputMode="numeric"
              onChangeText={onCounterChange}
              style={styles.input}
              value={counter}
            />
          </Field>
          <PrimaryButton label="Inspect prototype state" onPress={onInspect} />
          <Text style={styles.finePrint}>
            Use {demoTagRead.tagId} with counter {demoTagRead.counter} to view the included local
            fixture.
          </Text>
        </View>
        <View style={styles.resultPanel}>
          <View style={styles.resultHeading}>
            <View>
              <Text style={styles.panelNumber}>Evidence result</Text>
              <Text style={styles.panelTitle}>No verification has run.</Text>
            </View>
            <Text style={styles.prototypePill}>Prototype</Text>
          </View>
          {read ? (
            <View>
              <EvidenceLine
                label="NFC URL"
                status={`${read.tagId} / counter ${read.counter}`}
                tone="caution"
              />
              <EvidenceLine
                label="AES message validation"
                status={demoMatch ? "Local fixture only" : "No verifier connected"}
                tone="neutral"
              />
              <EvidenceLine
                label="On-chain counter rule"
                status="No registry connected"
                tone="neutral"
              />
              <EvidenceLine
                label="Artwork metadata"
                status={demoMatch ? "Illustrative fixture only" : "No record retrieved"}
                tone="neutral"
              />
              <EvidenceLine
                label="Artist identity"
                status="No World credential checked"
                tone="neutral"
              />
              <Text style={styles.resultCaption}>
                A final result can say “registered tag; metadata signed by a World-ID-verified
                artist account” only after the tag report, registry receipt, metadata bytes and
                artist status are independently available.
              </Text>
            </View>
          ) : (
            <Text style={styles.resultCaption}>
              Enter a valid uppercase tag identifier and a non-negative decimal counter to inspect
              the prototype result state.
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

function EvidenceLine({
  label,
  status,
  tone,
}: {
  label: string;
  status: string;
  tone: "caution" | "neutral";
}) {
  return (
    <View style={styles.evidenceLine}>
      <View style={[styles.statusDot, tone === "caution" && styles.statusDotCaution]} />
      <View style={styles.evidenceCopy}>
        <Text style={styles.evidenceLabel}>{label}</Text>
        <Text style={styles.evidenceStatus}>{status}</Text>
      </View>
    </View>
  );
}

function PrimaryButton({
  disabled = false,
  label,
  onPress,
}: {
  disabled?: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
    >
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

const displaySerif = Platform.select({
  default: "serif",
  web: "Georgia, 'Times New Roman', serif",
});

const styles = StyleSheet.create({
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 30 },
  aside: {
    alignSelf: "stretch",
    backgroundColor: "#203a32",
    borderRadius: 22,
    flex: 1,
    justifyContent: "center",
    minWidth: 280,
    padding: 28,
  },
  asideCopy: { color: "#d9e4d7", fontSize: 16, lineHeight: 25, marginTop: 16 },
  asideKicker: {
    color: "#e9a16e",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  asideTitle: {
    color: "#fffaf0",
    fontFamily: displaySerif,
    fontSize: 30,
    letterSpacing: -0.5,
    lineHeight: 36,
    marginTop: 12,
  },
  buttonDisabled: { backgroundColor: "#a9aca2" },
  evidenceCopy: { flex: 1 },
  evidenceLabel: { color: "#69736b", fontSize: 13, fontWeight: "700" },
  evidenceLine: {
    alignItems: "center",
    borderBottomColor: "#d8ddd5",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 10,
    paddingVertical: 13,
  },
  evidenceStatus: { color: "#1d2925", fontSize: 15, lineHeight: 21, marginTop: 2 },
  eyebrow: {
    color: "#9b3d22",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.45,
    textTransform: "uppercase",
  },
  feature: { flex: 1, minWidth: 220, paddingRight: 20 },
  featureCopy: { color: "#5e6962", fontSize: 15, lineHeight: 23, marginTop: 10 },
  featureGrid: { flexDirection: "row", flexWrap: "wrap", gap: 28, marginTop: 54 },
  featureIndex: { color: "#cf6943", fontSize: 13, fontWeight: "700" },
  featureTitle: {
    color: "#1d2925",
    fontFamily: displaySerif,
    fontSize: 24,
    lineHeight: 30,
    marginTop: 12,
  },
  field: { marginTop: 18 },
  fieldHalf: { flex: 1, minWidth: 150 },
  fieldLabel: { color: "#4d5853", fontSize: 13, fontWeight: "700", marginBottom: 7 },
  fieldRow: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  finePrint: { color: "#6d756e", fontSize: 12, lineHeight: 18, marginTop: 12 },
  header: {
    alignItems: "center",
    borderBottomColor: "#d9d2c7",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 20,
    paddingTop: 12,
  },
  headerActions: { flexDirection: "row", gap: 7 },
  hero: { maxWidth: 820, paddingTop: 88 },
  heroCopy: { color: "#526059", fontSize: 18, lineHeight: 29, marginTop: 22, maxWidth: 670 },
  heroMarker: { backgroundColor: "#cf6943", height: 5, marginBottom: 24, width: 56 },
  heroTitle: {
    color: "#1b3029",
    fontFamily: displaySerif,
    fontSize: 61,
    letterSpacing: -2.6,
    lineHeight: 63,
    marginTop: 14,
  },
  input: {
    backgroundColor: "#fffdf8",
    borderColor: "#cfd5cc",
    borderRadius: 10,
    borderWidth: 1,
    color: "#1d2925",
    fontSize: 16,
    minHeight: 46,
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
  journey: { paddingTop: 58 },
  journeyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 26,
    minHeight: 48,
  },
  localNotice: { backgroundColor: "#f4dfbb", borderRadius: 10, marginTop: 16, padding: 14 },
  localNoticeCopy: { color: "#594733", fontSize: 14, lineHeight: 21, marginTop: 4 },
  localNoticeTitle: { color: "#6e321a", fontSize: 14, fontWeight: "700" },
  navButton: { borderRadius: 99, paddingHorizontal: 13, paddingVertical: 8 },
  navButtonActive: { backgroundColor: "#1d392f" },
  navButtonText: { color: "#435149", fontSize: 14, fontWeight: "700" },
  navButtonTextActive: { color: "#fffaf0" },
  note: {
    backgroundColor: "#ead9c5",
    borderLeftColor: "#b9512c",
    borderLeftWidth: 4,
    marginTop: 56,
    maxWidth: 780,
    padding: 19,
  },
  noteCopy: { color: "#513d2c", fontSize: 15, lineHeight: 22, marginTop: 6 },
  noteLabel: {
    color: "#813619",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  page: { backgroundColor: "#f5f0e7", flex: 1 },
  pageIntro: { color: "#526059", fontSize: 17, lineHeight: 26, marginTop: 14, maxWidth: 710 },
  pageTitle: {
    color: "#1b3029",
    fontFamily: displaySerif,
    fontSize: 46,
    letterSpacing: -1.4,
    lineHeight: 51,
    marginTop: 12,
  },
  panel: {
    alignSelf: "stretch",
    backgroundColor: "#fffaf2",
    borderColor: "#ded8cd",
    borderRadius: 22,
    borderWidth: 1,
    flex: 1.35,
    minWidth: 300,
    padding: 28,
  },
  panelCopy: { color: "#59655e", fontSize: 16, lineHeight: 25, marginTop: 12 },
  panelNumber: {
    color: "#a54929",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  panelTitle: {
    color: "#1d2925",
    fontFamily: displaySerif,
    fontSize: 29,
    letterSpacing: -0.4,
    lineHeight: 35,
    marginTop: 8,
  },
  pressed: { opacity: 0.76 },
  primaryButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#b9502b",
    borderRadius: 9,
    marginTop: 20,
    paddingHorizontal: 17,
    paddingVertical: 13,
  },
  primaryButtonText: { color: "#fffaf0", fontSize: 15, fontWeight: "700" },
  previewMeta: { color: "#c2d2c5", fontSize: 14, lineHeight: 20, marginTop: 7 },
  previewRule: { backgroundColor: "#557166", height: 1, marginTop: 22 },
  previewTag: { color: "#fffaf0", fontFamily: "monospace", fontSize: 13, marginTop: 5 },
  previewTagLabel: {
    color: "#e9a16e",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginTop: 25,
    textTransform: "uppercase",
  },
  prototypePill: {
    backgroundColor: "#f2d5ad",
    borderRadius: 99,
    color: "#763519",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 6,
    textTransform: "uppercase",
  },
  resultCaption: { color: "#59655e", fontSize: 14, lineHeight: 22, marginTop: 20 },
  resultHeading: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resultPanel: {
    alignSelf: "stretch",
    backgroundColor: "#eff2eb",
    borderColor: "#d5dbd3",
    borderRadius: 22,
    borderWidth: 1,
    flex: 1,
    minWidth: 300,
    padding: 28,
  },
  scrollContent: { flexGrow: 1 },
  secondaryButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    borderColor: "#87938b",
    borderRadius: 9,
    borderWidth: 1,
    marginTop: 20,
    paddingHorizontal: 17,
    paddingVertical: 12,
  },
  secondaryButtonText: { color: "#31453b", fontSize: 15, fontWeight: "700" },
  shell: {
    alignSelf: "center",
    maxWidth: 1120,
    paddingBottom: 76,
    paddingHorizontal: 24,
    width: "100%",
  },
  statusDot: { backgroundColor: "#9ba39d", borderRadius: 99, height: 8, width: 8 },
  statusDotCaution: { backgroundColor: "#d48339" },
  stepDot: {
    alignItems: "center",
    backgroundColor: "#d4d9d1",
    borderRadius: 99,
    height: 27,
    justifyContent: "center",
    width: 27,
  },
  stepDotActive: { backgroundColor: "#1f4438" },
  stepDotText: { color: "#516159", fontSize: 12, fontWeight: "700" },
  stepDotTextActive: { color: "#fffaf0" },
  stepItem: { alignItems: "center", flexDirection: "row", gap: 8 },
  stepLabel: { color: "#788178", fontSize: 13, fontWeight: "700", textTransform: "capitalize" },
  stepLabelActive: { color: "#1d2925" },
  stepRail: { flexDirection: "row", flexWrap: "wrap", gap: 24, marginTop: 31 },
  textarea: { minHeight: 110, textAlignVertical: "top" },
  twoColumn: { flexDirection: "row", flexWrap: "wrap", gap: 20, marginTop: 25 },
  wordmark: {
    color: "#1d392f",
    fontFamily: displaySerif,
    fontSize: 27,
    fontWeight: "700",
    letterSpacing: -0.6,
  },
});
