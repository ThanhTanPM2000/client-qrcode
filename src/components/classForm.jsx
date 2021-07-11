import React, { PureComponent } from "react";
import _ from "lodash";

import FormCommon from "./common/form";
import SemesterService from "../services/semesterService";
import UserService from "../services/userService";
import ClassService from "../services/classService";

// react-bootstrap components
import { Form } from "react-bootstrap";
import { toast } from "react-toastify";

const Joi = require("joi").extend(require("@joi/date"));

class ClassForm extends FormCommon {
  state = {
    data: {
      classTermId: "",
      name: "",
      numOfCredits: "",
      courseType: "",
      schoolYear: "",
      startDate: null,
      endDate: null,
      room: "",
      dayOfWeek: "",
      numOfWeek: "",
      session: "",
      semesterId: "",
      lecturerMail: "",
    },
    semesters: [],
    lecturers: [],
    errors: {},
    isHandling: false,
  };

  schema = Joi.object({
    _id: Joi.string(),
    classTermId: Joi.string().required(),
    name: Joi.string().min(5).max(50).required().label("Class Name"),
    numOfCredits: Joi.number().required().label("Number Of Credits"),
    courseType: Joi.string().min(2).max(2).required().label("Course Type"),
    schoolYear: Joi.string().required().label("School Year"),
    startDate: Joi.date().required().label("Start Date"),
    endDate: Joi.date().required().label("End Date"),
    room: Joi.string().required().label("Room"),
    dayOfWeek: Joi.number().required().label("Day Of Week"),
    numOfWeek: Joi.number().required().label("Number Of Week"),
    session: Joi.string().required().label("Session"),
    semesterId: Joi.string().required().label("Semester"),
    lecturerMail: Joi.string().required().label("Lecturer"),
  });

  async populateSemesters() {
    const { data: semesters } = await SemesterService.getSemesters();
    const myData = { ...this.state.data };
    myData["semesterId"] = semesters[0]._id;
    this.setState({ semesters, data: myData });
  }

  async populateLecturer() {
    const { data: lecturers } = await UserService.getUsers();
    const myData = { ...this.state.data };
    myData["lecturerMail"] = lecturers[0].mail;
    this.setState({ lecturers, data: myData });
  }

  populateClasses() {
    const { selectedClass } = this.props;
    if (_.isEmpty(selectedClass)) return;
    this.setState({ data: this.mapToViewModel(selectedClass) });
  }

  async componentDidMount() {
    await this.populateSemesters();
    this.populateClasses();
  }

  mapToViewModel = (selectedClass) => {
    return {
      _id: selectedClass._id,
      classTermId: selectedClass.classTermId,
      name: selectedClass.name,
      numOfCredits: selectedClass.numOfCredits,
      courseType: selectedClass.courseType,
      schoolYear: selectedClass.schoolYear,
      startDate: new Date(selectedClass.startDate),
      endDate: new Date(selectedClass.endDate),
      session: selectedClass.session,
      room: selectedClass.room,
      dayOfWeek: selectedClass.dayOfWeek,
      numOfWeek: selectedClass.numOfWeek,
      semesterId: selectedClass.semester._id,
      lecturerMail: selectedClass.lecturer.mail,
    };
  };

  doSubmit = async () => {
    try {
      const { onUpdateClass } = this.props;
      console.log("sumit data ", this.state.data);
      const { data } = await ClassService.saveClass(this.state.data);
      toast.success("Successfully");
      onUpdateClass(data);
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  doChange = (input, data) => {
    return data;
  };

  render() {
    const { semesters } = this.state;

    console.log("data is ", this.state.data.startDate);

    return (
      <>
        <Form onSubmit={this.handleSubmit}>
          {this.renderInput("classTermId", "Class Id", "Class Term ID")}
          {this.renderInput("name", "Class Name", "Name of Class")}
          {this.renderInput(
            "numOfCredits",
            "Number Of Credits",
            "Number Of Credits in Class"
          )}
          {this.renderInput(
            "courseType",
            "Course Type",
            "Type of this class: TH-> Thuc hanh, LT -> Ly Thuyet"
          )}
          {this.renderInput("schoolYear", "School Year", "School Year")}
          {this.renderDatePicker(
            "startDate",
            "endDate",
            "Start Date - End Date"
          )}
          {this.renderInput("room", "Room", "Room of Class")}
          {this.renderInput(
            "dayOfWeek",
            "Day of Week",
            "Input Number etc: 2: Monday, 3: Tuesday ... "
          )}
          {this.renderInput(
            "numOfWeek",
            "Number of Week",
            "How many week through this Class"
          )}
          {this.renderInput("session", "Session", "This class take how long")}
          {this.renderInput("lecturerMail", "Lecturer", "Mail of Lecturer")}
          {this.renderSelect("semesterId", "Semester", semesters, "symbol")}
          {this.renderSubmit("Save")}
        </Form>
      </>
    );
  }
}

export default ClassForm;
