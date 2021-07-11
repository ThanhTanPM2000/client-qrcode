import React from "react";
import { Link } from "react-router-dom";
import TableCommon from "./common/table";

import { OverlayTrigger, Tooltip, Button } from "react-bootstrap";

const ManualAttendanceTable = ({
  students,
  sortColumn,
  onManualAttendance,
  onSort,
}) => {
  const columns = [
    { path: "studentId", label: "Student ID" },
    {
      path: "name",
      label: "Display Name",
      content: (student) => (
        <Link to={`/users/${student._id}`}>{student.name}</Link>
      ),
    },
    { path: "mail", label: "Mail" },
    {
      path: "status",
      label: "Status",
    },
    {
      key: "attendance",
      content: (student) => (
        <OverlayTrigger
          overlay={<Tooltip id="tooltip-537440761">Attendance..</Tooltip>}
        >
          <Button
            className="btn-fill btn-wd"
            type="button"
            variant={
              student.status === "Not Attendance" ? "success" : "warning"
            }
            onClick={() => onManualAttendance(student)}
          >
            {student.status === "Not Attendance"
              ? "Attendance"
              : "UnAttendance"}
          </Button>
        </OverlayTrigger>
      ),
    },
  ];

  return (
    <TableCommon
      columns={columns}
      data={students}
      sortColumn={sortColumn}
      onSort={onSort}
    />
  );
};

export default ManualAttendanceTable;
