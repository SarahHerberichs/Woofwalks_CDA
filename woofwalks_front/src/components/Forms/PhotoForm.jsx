const PhotoForm = ({ photo, onFileChange }) => {
    return (
           <div>
              <label>
                Photo:
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={onFileChange}
                  required
                />
              </label>
            </div>
    )
}

export default PhotoForm;