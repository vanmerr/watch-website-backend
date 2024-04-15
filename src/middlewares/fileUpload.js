const multer = require('multer')
const path = require('path');

// Định nghĩa nơi lưu trữ và tên tệp tải lên
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/assets/images'); // Thư mục lưu trữ tệp
    },
    filename: function (req, file, cb) {
        // Tạo tên tệp mới: ngày giờ hiện tại + tên gốc của tệp
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Kiểm tra kiểu tệp tải lên
function checkFileType(file, cb) {
    // Định nghĩa kiểu tệp hợp lệ
    const filetypes = /jpeg|jpg|png/;
    // Kiểm tra phần mở rộng
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Kiểm tra loại MIME
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images only!'); // Trả về lỗi nếu kiểu tệp không hợp lệ
    }
}

// Khởi tạo middleware multer
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Kiểm tra kiểu tệp trước khi lưu trữ
        checkFileType(file, cb);
    }
}).single('images'); // Tên trường trong form của client

// Middleware xử lý khi nhận yêu cầu từ client
function handleUpload(req, res, next) {
    // Xử lý việc tải lên file trước khi xử lý yêu cầu
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Trả về lỗi nếu có lỗi từ multer
            return res.status(400).json({ message: err.message });
        } else if (err) {
            // Trả về lỗi nếu có lỗi khác
            return res.status(500).json({ message: 'Server error' });
        }
        // Chuyển sang xử lý yêu cầu tiếp theo nếu không có lỗi
        next();
    });
}

module.exports = handleUpload;
