 //const express = require("express");
// const bodyParser = require('body-parser');
//
// const app = express();
// const port = process.env.PORT || 5432;
//
// app.use(bodyParser.json());
//
// // Örnek lider ve departmanlar verisi
// const leader = {
//   id: 1,
//   name: 'Admin',
// };
//
// const departments = [
//   { id: 1, name: 'HR' },
//   { id: 2, name: 'Finance' },
//   { id: 3, name: 'IT' },
//   // Diğer departmanlar...
// ];
//
// // Liderin seçtiği tarihi saklamak için değişken
// let selectedDate = null;
//
// // Liderin tarih seçimi yapmasını sağlayan endpoint
// app.post('/api/select-date', (req, res) => {
//   const { date } = req.body;
//   selectedDate = date;
//   res.json({ message: 'Tarih seçimi başarıyla kaydedildi.' });
// });
//
// // Liderin seçtiği tarihi ve departmanları görüntüleyen endpoint
// app.get('/api/get-selected-date', (req, res) => {
//   if (!selectedDate) {
//     res.json({ message: 'Lider henüz bir tarih seçmedi.' });
//   } else {
//     res.json({ leader: leader, selectedDate: selectedDate, departments: departments });
//   }
// });
//
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

 //------------------------------------------------------------------------------------
 // const express = require("express");
 // const cors = require("cors");
 // const { Client } = require("pg");
 //
 // const app = express();
 //
 // app.use(cors());
 // app.use(express.json());
 //
 //
 //
 // const client = new Client({
 //     user: 'postgres',
 //     host: 'localhost',
 //     database: 'Yasar_DB',
 //     password: '123',
 //     port: 5432,
 // });
 //
 // client.connect()
 //     .then(() => {
 //         console.log('Connected to PostgreSQL');
 //         // You can now execute your queries using the `client` object.
 //     })
 //     .catch(err => {
 //         console.error('Error connecting to PostgreSQL:', err);
 //     });
 // app.get("/deneme",(req, res)=> {
 //     res.json("Hello there from backend");
 // })
 //
 // app.listen(5432,()=>{
 //     console.log("listening port 5432")
 // })
//--------------------------------------------------------------------------------------
 const Pool = require("pg").Pool;

const pool= new Pool({
    user: "postgres",
    host: "localhost",
    database: "Yasar_DB",
    password: "123",
    port: 5432,

});

module.exports = pool;
