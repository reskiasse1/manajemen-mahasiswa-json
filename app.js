const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

function readStudents() {
  const data = fs.readFileSync('students.json', 'utf-8');
  return JSON.parse(data);
}

function writeStudents(data) {
  fs.writeFileSync('students.json', JSON.stringify(data, null, 2));
}

app.get('/students', (req, res) => {
  const students = readStudents();
  res.json(students);
});

app.get('/students/:id', (req, res) => {
  const students = readStudents();
  const student = students.find(s => s.id === req.params.id);
  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ message: "Mahasiswa tidak ditemukan" });
  }
});

app.post('/students', (req, res) => {
  const students = readStudents();
  const newStudent = {
    id: Date.now().toString(),
    nama: req.body.nama,
    npm: req.body.npm,
    jurusan: req.body.jurusan,
    angkatan: req.body.angkatan
  };
  students.push(newStudent);
  writeStudents(students);
  res.status(201).json(newStudent);
});

app.put('/students/:id', (req, res) => {
  const students = readStudents();
  const index = students.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });

  students[index] = { ...students[index], ...req.body };
  writeStudents(students);
  res.json(students[index]);
});

app.delete('/students/:id', (req, res) => {
  const students = readStudents();
  const index = students.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Mahasiswa tidak ditemukan" });

  const deleted = students.splice(index, 1);
  writeStudents(students);
  res.json({ message: "Mahasiswa dihapus", data: deleted[0] });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
