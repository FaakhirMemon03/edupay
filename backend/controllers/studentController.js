import Student from "../models/Student.js";
import User from "../models/User.js";

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin or Teacher
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find({ schoolId: req.user.schoolId }).populate(
      "parentId",
      "name email"
    );
    return res.json(students);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new student
// @route   POST /api/students
// @access  Private/Admin
export const addStudent = async (req, res) => {
  const { name, class: className, section, parentPhone, parentName, monthlyFee } = req.body;

  if (!name || !className || !section || !parentPhone || !parentName) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  try {
    // Check if parent user already exists (using parentPhone@edupay.com as a unique email format)
    const parentEmail = `${parentPhone.replace(/\s+/g, "")}@edupay.com`;
    let parent = await User.findOne({ email: parentEmail });

    if (!parent) {
      // Create parent user
      parent = await User.create({
        name: parentName,
        email: parentEmail,
        password: "parent123", // default password
        role: "parent",
        schoolId: req.user.schoolId,
      });
    }

    const student = await Student.create({
      name,
      class: className,
      section,
      parentId: parent._id,
      schoolId: req.user.schoolId,
      monthlyFee: monthlyFee || 2000,
    });

    const populatedStudent = await Student.findById(student._id).populate(
      "parentId",
      "name email"
    );

    return res.status(201).json(populatedStudent);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update student details
// @route   PUT /api/students/:id
// @access  Private/Admin
export const updateStudent = async (req, res) => {
  const { name, class: className, section, monthlyFee, parentName, parentPhone } = req.body;

  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Ensure student belongs to the admin's school
    if (student.schoolId.toString() !== req.user.schoolId.toString()) {
      return res.status(403).json({ message: "Not authorized to update this student" });
    }

    student.name = name || student.name;
    student.class = className || student.class;
    student.section = section || student.section;
    student.monthlyFee = monthlyFee !== undefined ? monthlyFee : student.monthlyFee;

    // If parent info is updated
    if (parentPhone && parentName) {
      const parentEmail = `${parentPhone.replace(/\s+/g, "")}@edupay.com`;
      let parent = await User.findOne({ email: parentEmail });

      if (!parent) {
        parent = await User.create({
          name: parentName,
          email: parentEmail,
          password: "parent123",
          role: "parent",
          schoolId: req.user.schoolId,
        });
      } else {
        parent.name = parentName;
        await parent.save();
      }
      student.parentId = parent._id;
    }

    await student.save();
    const populatedStudent = await Student.findById(student._id).populate(
      "parentId",
      "name email"
    );

    return res.json(populatedStudent);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Ensure student belongs to the admin's school
    if (student.schoolId.toString() !== req.user.schoolId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this student" });
    }

    await Student.deleteOne({ _id: req.params.id });
    return res.json({ message: "Student removed" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
