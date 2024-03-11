import React, { useState } from "react";
import { ImageBase64Data } from "~/renderer/components/CustomImage/types";
import { Step, StepProps } from "./types";
import ImageCropper, { CropParams } from "~/renderer/components/CustomImage/ImageCropper";
import StepFooter from "./StepFooter";
import { useTranslation } from "react-i18next";
import StepContainer from "./StepContainer";
import { analyticsPageNames, analyticsFlowName } from "./shared";
import TrackPage from "~/renderer/analytics/TrackPage";
import { CLSSupportedDeviceModelId } from "@ledgerhq/live-common/device/use-cases/isCustomLockScreenSupported";
import { getScreenVisibleAreaDimensions } from "@ledgerhq/live-common/device-core/customLockScreen/screenSpecs";

type Props = StepProps & {
  src?: ImageBase64Data;
  onResult(res: ImageBase64Data): void;
  initialCropParams?: CropParams;
  setCropParams(_: CropParams): void;
  deviceModelId: CLSSupportedDeviceModelId;
  deviceModelPicker: React.ReactNode;
};

const previousButtonEventProperties = {
  button: "Back",
};

const nextButtonEventProperties = {
  button: "Confirm crop",
};

const StepAdjustImage: React.FC<Props> = props => {
  const [loading, setLoading] = useState(true);
  const {
    src,
    onResult,
    onError,
    initialCropParams,
    setCropParams,
    setStep,
    deviceModelId,
    deviceModelPicker,
  } = props;
  const { t } = useTranslation();

  return (
    <StepContainer
      footer={
        <StepFooter
          previousStep={Step.chooseImage}
          previousLabel={t("common.back")}
          nextStep={Step.chooseContrast}
          nextLabel={t("customImage.steps.adjust.confirmCrop")}
          nextLoading={loading}
          nextDisabled={loading}
          previousTestId="custom-image-crop-previous-button"
          nextTestId="custom-image-crop-continue-button"
          setStep={setStep}
          previousEventProperties={previousButtonEventProperties}
          nextEventProperties={nextButtonEventProperties}
        />
      }
    >
      <TrackPage
        category={analyticsPageNames.preview}
        type="drawer"
        flow={analyticsFlowName}
        refreshSource={false}
      />
      {deviceModelPicker}
      {src ? (
        <ImageCropper
          {...src}
          initialCropParams={initialCropParams}
          setCropParams={setCropParams}
          targetDimensions={getScreenVisibleAreaDimensions(deviceModelId)}
          onResult={onResult}
          onError={onError}
          setLoading={setLoading}
        />
      ) : null}
    </StepContainer>
  );
};

export default StepAdjustImage;
