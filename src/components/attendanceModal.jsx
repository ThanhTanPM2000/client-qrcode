import React from "react";
import ReactDOM from "react-dom";
import Joi from "joi";
import { toast } from "react-toastify";
import QrCode from "qrcode";
import Timer from "react-compound-timer";

import { Modal, Table, Row, Col } from "react-bootstrap";
import FormCommon from "./common/form";

import "../assets/css/attendance.css";
import LessonService from "services/lessonService";
import ManualAttendance from "./manualAttendance";

class AttendanceModal extends FormCommon {
  state = {
    data: {
      expiredTime: 0,
    },
    qrCode: "",
    qrCodeImage: "",
    step: 1,
    countDownDate: new Date(),
    timerText: "",
    errors: [],
    interval: "",
  };

  schema = Joi.object({
    expiredTime: Joi.number().min(1).max(100).required(),
  });

  nextStep = () => {
    const { step } = this.state;
    this.setState({ step: step + 1 });
  };

  doSubmit = () => {};

  doChange = (input, data) => {
    return data;
  };

  handleCreateQrCode = async (e) => {
    e.preventDefault();

    const { myClass, selectedLesson } = this.props;
    const { qrCode, data } = this.state;

    let qrCodeText = `${myClass._id}_${
      selectedLesson.order
    }_${new Date().toISOString()}`;

    try {
      const { data: _class } = await LessonService.saveQrCode(
        myClass,
        selectedLesson,
        qrCodeText,
        data.expiredTime
      );

      const url = await QrCode.toDataURL(qrCodeText, { quality: 1 });

      this.setState({
        "data.qrCode": qrCodeText,
        qrCodeImage: url,
      });
      this.nextStep();
    } catch (error) {
      toast.error(error.response?.data);
    }
  };

  handleCountDown = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      this.handleExitModal();
    } else {
      // Render a countdown
      return (
        <span>
          {hours}:{minutes}:{seconds}
        </span>
      );
    }
  };

  handleExitModal = () => {
    let { data } = this.state;
    data.expiredTime = 0;

    this.setState({ step: 1, data });
  };

  render() {
    const { selectedLesson, myClass, ...otherProps } = this.props;
    const { step, qrCodeImage, data } = this.state;

    switch (step) {
      case 1:
        return (
          <React.Fragment>
            <Modal
              size="xl"
              backdrop="static"
              centered
              aria-labelledby="gogo"
              {...otherProps}
            >
              <Modal.Header closeButton>
                <Modal.Title id="gogo">
                  Attendance {selectedLesson?.name}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={(e) => this.handleCreateQrCode(e)}>
                  {this.renderInput(
                    "expiredTime",
                    "Expired Time QrCode",
                    "1 or (any) minutes ..."
                  )}
                  <div className="text-right">
                    {this.renderSubmit("Continue")}
                  </div>
                </form>
              </Modal.Body>
            </Modal>
          </React.Fragment>
        );
      case 2:
        return (
          <React.Fragment>
            <Modal
              size="xl"
              dialogClassName="attendanceMD"
              backdrop="static"
              keyboard={false}
              centered
              onExit={this.handleExitModal}
              aria-labelledby="gogo"
              {...otherProps}
            >
              <Modal.Header closeButton>
                <Modal.Title id="gogo">
                  Attendance {selectedLesson?.name}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Col className="qrCode">
                    {qrCodeImage && (
                      <React.Fragment>
                        <img
                          src={qrCodeImage}
                          alt="QrCode"
                          style={{ width: "500px", height: "500px" }}
                        />

                        <Timer
                          initialTime={data.expiredTime * 60 * 1000}
                          direction="backward"
                        >
                          {() => (
                            <React.Fragment>
                              <Timer.Hours /> hours <Timer.Minutes /> minutes{" "}
                              <Timer.Seconds /> seconds
                            </React.Fragment>
                          )}
                        </Timer>
                      </React.Fragment>
                    )}
                  </Col>
                  <Col>
                    <ManualAttendance
                      myClass={myClass}
                      lesson={selectedLesson}
                    />
                  </Col>
                </Row>
              </Modal.Body>
            </Modal>
          </React.Fragment>
        );
    }
  }
}

export default AttendanceModal;
