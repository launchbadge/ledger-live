import { useCallback, useEffect, useState } from "react";
import { AppManifest } from "@ledgerhq/live-common/wallet-api/types";
import { Web3HubDB } from "LLM/features/Web3Hub/types";
import { useWeb3HubDB } from "LLM/features/Web3Hub/db";

const dismissedManifestsSelector = (state: Web3HubDB) => state.dismissedManifests;

export function useDismissedManifests() {
  return useWeb3HubDB<Web3HubDB["dismissedManifests"]>(dismissedManifestsSelector);
}

export default function useDisclaimerViewModel(goToApp: (manifestId: string) => void) {
  const [isChecked, setIsChecked] = useState(false);
  const [disclaimerOpened, setDisclaimerOpened] = useState(false);
  const [disclaimerManifest, setDisclaimerManifest] = useState<AppManifest>();
  const [dismissedManifests, setWeb3HubDB] = useDismissedManifests();

  useEffect(() => {
    if (disclaimerManifest && !!dismissedManifests[disclaimerManifest.id]) {
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  }, [disclaimerManifest, dismissedManifests]);

  const onPressItem = useCallback(
    (manifest: AppManifest) => {
      if (manifest.branch === "soon") {
        return;
      }

      if (!dismissedManifests[manifest.id] && manifest.author !== "ledger") {
        setDisclaimerManifest(manifest);
        setDisclaimerOpened(true);
      } else {
        // TODO append recently used
        goToApp(manifest.id);
      }
    },
    [dismissedManifests, goToApp],
  );

  const toggleCheck = useCallback(() => {
    setIsChecked(value => !value);
  }, []);

  const onConfirm = useCallback(() => {
    if (disclaimerManifest) {
      if (isChecked) {
        setWeb3HubDB(state => ({
          ...state,
          dismissedManifests: {
            ...state.dismissedManifests,
            [disclaimerManifest.id]: !state.dismissedManifests[disclaimerManifest.id],
          },
        }));
      }

      goToApp(disclaimerManifest.id);
    }
  }, [disclaimerManifest, goToApp, isChecked, setWeb3HubDB]);

  const onClose = useCallback(() => {
    setDisclaimerOpened(false);
  }, []);

  return {
    manifest: disclaimerManifest,
    isOpened: disclaimerOpened,
    isChecked,
    toggleCheck,
    onConfirm,
    onClose,
    onPressItem,
  };
}
