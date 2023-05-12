import "./modal.css"
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal">
                {children}
                <button className="modal-close" onClick={onClose}>
                    Закрыть
                </button>
            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default Modal
