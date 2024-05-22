import { useContext } from "react";
import { Offcanvas, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import {
  Phone,
  Mailbox,
  CardChecklist,
  Buildings,
  Virus,
  Cursor,
} from "react-bootstrap-icons";

// This component is used to display the user's profile information

type ProfileProps = {
  isOpen: boolean;
  close: () => void;
};

export function ProfileMenu({ isOpen, close }: ProfileProps) {
  const authContext = useContext(AuthContext);
  // console.log(isOpen);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { userInfo } = authContext;
  return (
    <Offcanvas show={isOpen} onHide={close} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title> Profile </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Stack gap={3}>
          <div className="d-flex align-items-center">
            <CardChecklist width="16" height="16" className="me-2" />
            <strong className="me-1">Name:</strong>
            <span>{userInfo?.name}</span>
          </div>
          <div className="d-flex align-items-center">
            <Mailbox width="16" height="16" className="me-2" />
            <strong>Email:</strong>
            <span>{userInfo?.email}</span>
          </div>
          <div className="d-flex align-items-center">
            <Virus width="16" height="16" className="me-2" />
            <strong>Role:</strong>
            <span>{userInfo?.role_name}</span>
          </div>
          <div className="d-flex align-items-center">
            <Buildings width="16" height="16" className="me-2" />
            <strong>Department:</strong>
            <span>{userInfo?.department_name}</span>
          </div>
          <div className="d-flex align-items-center">
            <Phone width="16" height="16" className="me-2" />
            <strong>Phone Number:</strong>
            <span>{userInfo?.phone_number}</span>
          </div>
          <div className="d-flex align-items-center">
            <Cursor width="16" height="16" className="me-2" />
            <strong>Employee Status:</strong>
            <span>{userInfo?.employStatus}</span>
          </div>
        </Stack>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
