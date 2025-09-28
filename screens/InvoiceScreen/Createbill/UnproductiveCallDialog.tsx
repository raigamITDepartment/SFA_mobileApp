import React, { useState } from 'react';
import { Button, Dialog, Menu, Portal } from 'react-native-paper';

const UNPRODUCTIVE_REASONS = [
  { id: 1, reason: 'Shop Closed' },
  { id: 2, reason: 'Owner Not Available' },
  { id: 3, reason: 'No Stock Required' },
  { id: 4, reason: 'Credit Issue' },
  { id: 5, reason: 'Other' },
];

type UnproductiveCallDialogProps = {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (reason: { id: number; reason: string }) => void;
  loading: boolean;
};

const UnproductiveCallDialog = ({
  visible,
  onDismiss,
  onSubmit,
  loading,
}: UnproductiveCallDialogProps) => {
  const [selectedReason, setSelectedReason] = useState<{ id: number; reason: string } | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleSelectReason = (reason: { id: number; reason: string }) => {
    setSelectedReason(reason);
    closeMenu();
  };

  const handleSubmit = () => {
    if (selectedReason) {
      onSubmit(selectedReason);
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Unproductive Call</Dialog.Title>
        <Dialog.Content>
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <Button onPress={openMenu} mode="outlined">
                {selectedReason ? selectedReason.reason : 'Select a Reason'}
              </Button>
            }
          >
            {UNPRODUCTIVE_REASONS.map((reason) => (
              <Menu.Item
                key={reason.id}
                onPress={() => handleSelectReason(reason)}
                title={reason.reason}
              />
            ))}
          </Menu>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} disabled={loading}>
            Cancel
          </Button>
          <Button onPress={handleSubmit} disabled={!selectedReason || loading} loading={loading}>
            OK
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default UnproductiveCallDialog;