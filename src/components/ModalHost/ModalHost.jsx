import "./ModalHost.css";
import { ui, closeModal } from "../../lib/uiStore";
import Modal from "../Modal/Modal";
import EventModal from "../../sections/Events/EventModal";
import { GalleryPhoto } from "../../sections/Gallery/Gallery";

/* Renders whichever content modal is open (event, photo) */
export default function ModalHost() {
  const modal = ui.use((s) => s.modal);
  if (!modal) return null;

  if (modal.kind === "event") {
    return (
      <Modal label={`MISSION FILE // ${modal.item.title}`} onClose={closeModal}>
        <EventModal event={modal.item} />
      </Modal>
    );
  }

  if (modal.kind === "photo") {
    return (
      <Modal label={`MEMORY BANK // ${modal.item.caption}`} onClose={closeModal} className="is-photo">
        <div className="photo-view">
          <GalleryPhoto item={modal.item} />
        </div>
      </Modal>
    );
  }

  return null;
}
