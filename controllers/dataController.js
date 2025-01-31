const axiosInstance = require("../lib/axios")
const { photo, tag, searchHistory } = require("../models")
const { validateSearchImageQuery, validateTags, validateImageUrl, validateSearchTags } = require("../validations")
const { Op } = require("sequelize");

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

        res.json({ photos: photos })
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch photos", error: error.response.data
        })
    }
}


const savePhoto = async (req, res) => {
    try {
        const { imageUrl, description, altDescription, tags, userId } = req.body

        if (!validateImageUrl(imageUrl)) {
            return res.status(400).json({ message: "Invalid image URL" });
        }

        const tagValidationError = validateTags(tags)
        if (tagValidationError) {
            return res.status(400).json({
                message: tagValidationError
            })
        }

        const newPhoto = await photo.create({ imageUrl, description, altDescription, userId })

        if (tags.length > 0 && tags.length <= 5) {
            for (const newtag of tags) {
                if (newtag.length < 20) {
                    await tag.create({
                        name: newtag,
                        photoId: newPhoto.id
                    })
                }
            }
        }

        res.status(200).json({
            message: 'Photo saved successfully'
        })


    } catch (error) {
        res.status(500).json({
            message: "Failed to add new photo"
        })
    }
}

const addtags = async (req, res) => {
    try {
        const { photoId } = req.params
        const { tags } = req.body;

        const tagValidationError = validateTags(tags)
        if (tagValidationError) {
            return res.status(400).json({
                message: tagValidationError
            })
        }

        const image = await photo.findByPk(photoId, {
            include: { model: tag }
        })

        if (!image) {
            return res.status(404).json({ message: "Photo not found" });
        }

        const existingTags = image.tags.map(t => t.name);
        const tagsCount = existingTags.length + tags.length;

        if (tagsCount > 5) {
            res.status(400).json({
                message: "Each photo can contain max 5 tags"
            })
        }

        const newTags = []
        for (const tagName of tags) {
            newTags.push({
                name: tagName,
                photoId
            })
        }

        if (newTags.length > 0) {
            await tag.bulkCreate(newTags);
        }
        return res.json({
            message: 'Tags added successfully'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error while adding tags."
        })
    }
}

const searchPhotosByTags = async (req, res) => {
    try {
        const { tags, sort = "ASC", userId } = req.query

        const validateTagsAndSort = validateSearchTags(tags, sort)
        if (validateTagsAndSort) {
            return res.status(400).json({
                message: validateTagsAndSort
            })
        }

        await searchHistory.create({
            userId,
            query: tags
        })

        const tagsExists = await tag.findAll({
            where: { name: tags }
        })

        let photoIds = tagsExists.map(tag => tag.photoId);
        if (photoIds.length === 0) {
            return res.status(400).json({ message: "No photos found with this tag." });
        }

        const existingPhoto = await photo.findAll({
            where: { id: { [Op.in]: photoIds } },
            order: [["dateSaved", sort]],
            attributes: ["imageUrl", "description", "dateSaved"],

            include: [
                {
                    model: tag,
                    attributes: ["name"],
                }
            ]
        })

        if (!existingPhoto) return res.status(400).json({
            message: "No photos found."
        })

        res.status(200).json({
            photos: existingPhoto
        })


    } catch (error) {
        console.log("error fetching photod", error)
        res.status(500).json({
            message: "Error while fetching photos by tags."
        })
    }
}

module.exports = { searchImages, savePhoto, addtags, searchPhotosByTags }
