import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { setUploadProgress } from "../../redux/reducers/videoReducer";

const UploadModal = ({ isOpen, onClose, message = "Upload thành công!" }) => {
  const progress = useSelector((state) => state.video.progress);
  const isUploaded = useSelector((state) => state.video.isUploaded);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(isOpen);

  // Mở modal khi prop thay đổi
  useEffect(() => {
    setShowModal(isOpen);
    // dispatch(setUploadProgress(0));
  }, [isOpen]);

  const handleClose = () => {
    setShowModal(false);
    onClose();
    navigate("/studio/content-management/videos");
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm text-center shadow-xl w-80"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Tiêu đề */}
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {isUploaded ? message : "Đang tải video..."}
            </h2>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <motion.div
                className="bg-blue-600 h-4 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.3 }}
              />
            </div>

            {/* Text % */}
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {progress < 100 ? `${progress}%` : isUploaded ? "Hoàn tất!" : "Đang xử lý..."}
            </p>

            {isUploaded && (
              <motion.button
                onClick={handleClose}
                className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Đóng
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UploadModal;