const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

// Örnek lider ve departmanlar verisi
const leader = {
  id: 1,
  name: 'Admin',
};

const departments = [
  { id: 1, name: 'HR' },
  { id: 2, name: 'Finance' },
  { id: 3, name: 'IT' },
  // Diğer departmanlar...
];

// Liderin seçtiği tarihi saklamak için değişken
let selectedDate = null;

// Liderin tarih seçimi yapmasını sağlayan endpoint
app.post('/api/select-date', (req, res) => {
  const { date } = req.body;
  selectedDate = date;
  res.json({ message: 'Tarih seçimi başarıyla kaydedildi.' });
});

// Liderin seçtiği tarihi ve departmanları görüntüleyen endpoint
app.get('/api/get-selected-date', (req, res) => {
  if (!selectedDate) {
    res.json({ message: 'Lider henüz bir tarih seçmedi.' });
  } else {
    res.json({ leader: leader, selectedDate: selectedDate, departments: departments });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
