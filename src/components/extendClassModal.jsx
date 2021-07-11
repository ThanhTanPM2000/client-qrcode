import React from "react";
import { Modal, Tabs, Tab, Button } from "react-bootstrap";

import "../assets/css/extendClassModal.css";
import Lesson from "./lessons";
import Student from "../components/students";

const ExtendClassModal = ({
  titleHeader,
  onUpdateStudent,
  onDeleteStudent,
  selectedClass,
  ...otherProps
}) => {
  return (
    <div className="extendClassModal">
      <Modal
        size="xl"
        backdrop="static"
        dialogClassName="attendanceMD"
        centered
        aria-labelledby="gogo"
        {...otherProps}
      >
        <Modal.Header closeButton>
          <Modal.Title id="gogo">
            Class {selectedClass?.name} - {selectedClass?.classTermId}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="attendance" id="uncontrolled-tab-example">
            <Tab eventKey="attendance" title="Attendance">
              <Lesson myClass={selectedClass} />
            </Tab>
            <Tab eventKey="students" title="Manage Student">
              <Student
                onUpdateStudent={onUpdateStudent}
                onDeleteStudent={onDeleteStudent}
                myClass={selectedClass}
              />
            </Tab>

            <Tab eventKey="statistical" title="Statistical"></Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ExtendClassModal;
