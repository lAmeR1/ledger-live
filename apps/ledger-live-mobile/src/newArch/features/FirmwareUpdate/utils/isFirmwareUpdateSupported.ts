import { Platform } from "react-native";
import { DeviceModelInfo } from "@ledgerhq/types-live";
import { DeviceModelId } from "@ledgerhq/devices";
import isFirmwareUpdateVersionSupported from "@ledgerhq/live-common/hw/isFirmwareUpdateVersionSupported";
import { lastConnectedDeviceSelector } from "~/reducers/settings";

export function isNewFirmwareUpdateUxSupported(deviceModelId?: DeviceModelId) {
  switch (deviceModelId) {
    case DeviceModelId.stax:
    case DeviceModelId.europa:
      return true;
    default:
      return false;
  }
}

export function isOldFirmwareUpdateUxSupported({
  lastSeenDeviceModelInfo,
  lastConnectedDevice,
}: {
  lastSeenDeviceModelInfo: DeviceModelInfo | null;
  lastConnectedDevice: ReturnType<typeof lastConnectedDeviceSelector>;
}) {
  const isUsbFwVersionUpdateSupported = Boolean(
    lastSeenDeviceModelInfo &&
      isFirmwareUpdateVersionSupported(
        lastSeenDeviceModelInfo.deviceInfo,
        lastSeenDeviceModelInfo.modelId,
      ) &&
      Platform.OS === "android",
  );
  const deviceIsWired = Boolean(lastConnectedDevice?.wired);
  const updateSupported = isUsbFwVersionUpdateSupported && deviceIsWired;
  const updateSupportedButDeviceNotWired = isUsbFwVersionUpdateSupported && !deviceIsWired;

  return {
    updateSupported,
    updateSupportedButDeviceNotWired,
  };
}
