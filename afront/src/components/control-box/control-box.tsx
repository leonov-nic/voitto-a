import Box from '@mui/material/Box';
import ButtonOpenDialogRemoveEmployee from '../button-open-dialog-remove-employee/button-open-dialog-remove-employee';
import ButtonOpenDialogAddEmployee from '../button-open-dialog-add-employee/button-open-dialog-add-employee';
import ButtonOpenDialogEditEmployee from '../button-open-dialog-edit-employee/button-open-dialog-edit-employee';
import ButtonOpenDialogAddDetail from '../button-open-dialog-add-detail/button-open-dialog-add-detail';

export default function ControlBox() {

  return (
    <Box
      marginTop="10px"
      marginBottom="10px"
      display="flex"
      flexDirection={"row"}
      alignItems="start"
      sx={{ backgroundColor: "#96b8cc", p: 0, ariaLabel: 'Without label'}}
    >
      <ButtonOpenDialogAddEmployee/>
      <ButtonOpenDialogEditEmployee/>
      <ButtonOpenDialogRemoveEmployee/>
      <ButtonOpenDialogAddDetail/>
    </Box>
  );
}
