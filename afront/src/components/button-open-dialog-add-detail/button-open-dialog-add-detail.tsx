import * as S from './but-add-detail.styled';
import { CustomButton } from '../common/button/button';
import { useState } from 'react';
import DialogAddDetail from '../dialog-add-detail/dialog-add-detail';

export default function ButtonOpenDialogAddDetail() {
  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => {
    setOpen(!open)
  }

  const handleCloseDialog = () => {
    setOpen(false)
  }

  return (
    <>
      <CustomButton
        data-name='111'
        sx={{ backgroundColor: "#17c1bc", boxShadow: "none", p: 1, borderRadius: 60, minWidth: 0, mx: 1 }}
        onClick={handleOpenDialog}
      >
        <S.IconWorker/>
      </CustomButton>
      <DialogAddDetail open={open} onClose={handleCloseDialog}/>
    </>
  );
}
