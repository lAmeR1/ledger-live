/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import useAddAccountDrawer from "LLM/features/WalletSync/hooks/useAddAccountDrawer";
import DummyDrawer from "../DummyDrawer";
import ActionRow from "../components/ActionRow";
import QueuedDrawer from "~/components/QueuedDrawer";
import { useTranslation } from "react-i18next";
import { TrackScreen } from "~/analytics";
import { Flex, Icons, Text } from "@ledgerhq/native-ui";
import { AddAccountDrawerProps } from "LLM/features/WalletSync/types/addAccountDrawer";

const AddAccountDrawer = ({
  isOpened,
  currency,
  doesNotHaveAccount,
  onClose,
  reopenDrawer,
}: AddAccountDrawerProps) => {
  const { t } = useTranslation();
  const rows = [];

  const {
    isWalletSyncEnabled,
    isReadOnlyModeEnabled,
    isAddAccountDrawerVisible,
    isWalletSyncDrawerVisible,
    onClickAdd,
    onClickImport,
    onClickWalletSync,
    onCloseAddAccountDrawer,
    onCloseWalletSyncDrawer,
  } = useAddAccountDrawer({ isOpened, currency, onClose, reopenDrawer });

  if (!isReadOnlyModeEnabled) {
    rows.push({
      titleKey: "addAccountsModal.drawer.add.title",
      descriptionKey: "addAccountsModal.drawer.add.description",
      onPress: onClickAdd,
      icon: <Icons.LedgerDevices color={"primary.c80"} />,
      testID: "add-accounts-modal-add-button",
    });
  }

  if (isWalletSyncEnabled) {
    rows.push({
      titleKey: "addAccountsModal.drawer.walletSync.title",
      descriptionKey: "addAccountsModal.drawer.walletSync.description",
      onPress: onClickWalletSync,
      icon: <Icons.QrCode color={"primary.c80"} />,
    });
  } else {
    rows.push({
      titleKey: "addAccountsModal.drawer.import.title",
      descriptionKey: "addAccountsModal.drawer.import.description",
      onPress: onClickImport,
      icon: <Icons.QrCode color={"primary.c80"} />,
    });
  }

  return (
    <>
      <QueuedDrawer
        isRequestingToBeOpened={isAddAccountDrawerVisible}
        onClose={onCloseAddAccountDrawer}
      >
        <TrackScreen category="Add/Import accounts" type="drawer" />
        <Text variant="h4" fontWeight="semiBold" fontSize="24px" mb={16}>
          {doesNotHaveAccount
            ? t("addAccountsModal.title")
            : t("addAccountsModal.drawer.drawerTitleHasAccount")}
        </Text>
        <Text variant="large" fontWeight="medium" fontSize="14px" color="neutral.c70" mb="32px">
          {t("addAccountsModal.drawer.drawerSubTitle")}
        </Text>
        <Flex flexDirection="column" rowGap={16}>
          {rows.map((row, index) => (
            <ActionRow
              key={index}
              title={t(row.titleKey)}
              description={t(row.descriptionKey)}
              onPress={row.onPress}
              icon={row.icon}
              testID={row.testID}
            />
          ))}
        </Flex>
      </QueuedDrawer>
      <DummyDrawer isOpen={isWalletSyncDrawerVisible} handleClose={onCloseWalletSyncDrawer} />
    </>
  );
};

export default AddAccountDrawer;
