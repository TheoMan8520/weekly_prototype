import axios from "axios"
import { useEffect, useState } from "react"
import Modal from "react-modal"
import Swal from "sweetalert2"
import "../css/create-record.css"

interface Props {
  isOpen: boolean
  onRequestClose: () => void
  id: number
  stickerIn: string
  categoryIn: string
}

const UpdateCategory = ({
  isOpen,
  onRequestClose,
  id,
  stickerIn,
  categoryIn,
}: Props) => {
  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    content: {
      top: "22%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      border: "",
      background: "#F5F5F5",
      borderRadius: "40px",
      width: "100%",
      maxWidth: "700px",
    },
  }

  const [sticker, setSticker] = useState("")
  const [category, setCategory] = useState("")

  const updateCategory = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("sticker", sticker)
    formData.append("category", category)

    try {
      const response = await axios.post(
        `http://localhost:8000/api/categories/${id}`,
        formData
      )
      Swal.fire({
        icon: "success",
        text: response.data.message,
      })
      closeModal()
    } catch (error) {
      console.error(error)
      Swal.fire({
        text: "An error occurred while processing the request.",
        icon: "error",
      })
    }
  }

  const closeModal = async () => {
    setSticker(stickerIn)
    setCategory(categoryIn)
    onRequestClose()
  }

  const deleteCategory = async (e) => {
    e.preventDefault()
    await axios
      .delete(`http://localhost:8000/api/categories/${id}`)
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message,
        })
        // setFirstRender(true)
        // onRequestClose()
        closeModal()
      })
      .catch(({ response: { data } }) => {
        Swal.fire({
          text: data.message,
          icon: "error",
        })
      })
  }

  useEffect(() => {
    setSticker(stickerIn)
    setCategory(categoryIn)
  }, [id])

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Create Modal"
      style={customStyles}
      className="modal category"
    >
      <div className="head">
        <h2>Update Category</h2>
      </div>
      <form className="form">
        <div className="input-unit category">
          <div className="icon">
            <input
              required
              className="input sticker"
              type="text"
              value={sticker}
              onChange={(event) => {
                setSticker(event.target.value)
              }}
            />
          </div>
          <div className="input-frame">
            <h2>Category:</h2>
            <input
              required
              className="input drop-down"
              type="text"
              value={category}
              onChange={(event) => {
                setCategory(event.target.value)
              }}
            />
          </div>
        </div>
        <div className="buttons">
          <button className="button delete" onClick={closeModal}>
            CANCEL
          </button>
          <button className="button delete" onClick={deleteCategory}>
            DELETE
          </button>
          <button
            className="button save"
            onClick={updateCategory}
            type="submit"
          >
            SAVE
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default UpdateCategory
