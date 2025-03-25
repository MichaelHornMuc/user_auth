import multer from 'multer'
import authenticationRouter from '../routes/jwtAuth.js'

// const upload = multer({ dest: '../public/uploads/' })

// authenticationRouter.post('stats', upload.single('uploaded_file', (req, res) => {
//   // Process the uploaded file and generate the stats
//   res.json({ message: 'File uploaded successfully' })
// }))

// export default upload