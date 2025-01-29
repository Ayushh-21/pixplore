const axiosInstance = require("../lib/axios")
const { validateSearchImageQuery } = require("../validations")


const searchImages = async (req, res) => {
    const errors = validateSearchImageQuery(req.query)
    if (errors.length > 0) return res.status(400).json({ errors })

    try {
        const { query } = req.query
        const response = await axiosInstance.get(`/search/photos`, {
            params: { query },
            per_page: 10
        })

        if (!response.data) return res.status(400).json({
            message: "Unable to fetch photos"
        })

        const data = response.data.results
        const photos = []
        for (const photo of data) {
            photos.push({
                imageUrl: photo.urls.regular,
                description: photo.description || "No description available",
                altDescription: photo.alt_description || "No alternative description available"
            })
        }

        // const data = response.data.results.map((photo) => ({
        //     imageUrl: photo.urls.regular,
        //     description: photo.description || "No description available",
        //     altDescription: photo.alt_description || "No alternative description available"
        // }))

        res.json({ photos: photos })
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch photos", error: error.response.data
        })
    }
}


module.exports = { searchImages }