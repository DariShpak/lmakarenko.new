document.addEventListener("DOMContentLoaded", () => {
  const openFormModalButtons = document.querySelectorAll("[data-modal-open]")
  const formModal = document.querySelector("[data-modal]")
  const closeFormModalButton = document.querySelector("[data-modal-close]")
  const openAboutModalButton = document.querySelector("[data-about-modal-open]")
  const aboutModal = document.getElementById("about-modal")
  const closeAboutModalButton = document.querySelector(
    "[data-about-modal-close]"
  )

  openFormModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const source = button.getAttribute("data-source")
      document.getElementById("source-input").value = source
      formModal.classList.remove("is-hidden")
    })
  })

  closeFormModalButton.addEventListener("click", () => {
    formModal.classList.add("is-hidden")
  })

  document.querySelectorAll(".backdrop").forEach((backdrop) => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        backdrop.classList.add("is-hidden")
      }
    })
  })

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!formModal.classList.contains("is-hidden")) {
        formModal.classList.add("is-hidden")
      }
      if (!aboutModal.classList.contains("is-hidden")) {
        aboutModal.classList.add("is-hidden")
      }
    }
  })

  document
    .getElementById("my-form")
    .addEventListener("submit", function (event) {
      event.preventDefault()
      const form = event.target
      const formData = new FormData(form)

      fetch("https://formspree.io/f/movajqej", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      })
        .then((response) => {
          if (response.ok) {
            form.style.display = "none"
            document.getElementById("successMessage").style.display = "block"
            form.reset()
          } else {
            return response.json().then((data) => {
              if (Object.hasOwn(data, "errors")) {
                const errorMessage = data["errors"]
                  .map((error) => error["message"])
                  .join(", ")
                throw new Error(errorMessage)
              } else {
                throw new Error("Unknown error occurred")
              }
            })
          }
        })
        .catch((error) => {
          document.getElementById("errorMessage").style.display = "block"
          console.error("There was an error!", error)
        })
    })
})
