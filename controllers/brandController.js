const Brand = require("../models/brand");
const Bike = require("../models/bike");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Display list of all brands.
exports.brand_list = asyncHandler(async (req, res, next) => {
  const allBrands = await Brand.find({}, "name").sort({ model: 1 }).exec();
  res.render("brand_list", { title: "Brand List", brand_list: allBrands });
});

// Display detail page for a specific brand.
exports.brand_detail = asyncHandler(async (req, res, next) => {
  // Get details of brand and all their bikes (in parallel)
  const [brand, allBikesByBrand] = await Promise.all([
    Brand.findById(req.params.id).exec(),
    Bike.find({ brand: req.params.id }, "model summary").exec(),
  ]);

  if (brand === null) {
    // No results.
    const err = new Error("Brand not found");
    err.status = 404;
    return next(err);
  }

  res.render("brand_detail", {
    title: "Brand Detail",
    brand: brand,
    brand_bikes: allBikesByBrand,
  });
});

// Display brand create form on GET.
exports.brand_create_get = asyncHandler(async (req, res, next) => {
  res.render("brand_form", { title: "Create Brand" });
});

// Handle Brand create on POST.
exports.brand_create_post = [
  // Validate and sanitize fields.
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified.")
    .isAlphanumeric()
    .withMessage("Name has non-alphanumeric characters."),
  body("origin").trim().escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Brand object with escaped and trimmed data
    const brand = new Brand({
      name: req.body.name,
      origin: req.body.origin,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("brand_form", {
        title: "Create Brand",
        brand: brand,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.

      // Save brand.
      await brand.save();
      // Redirect to new brand record.
      res.redirect(brand.url);
    }
  }),
];

// Display brand delete form on GET.
exports.brand_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: brand delete GET");
});

// Handle brand delete on POST.
exports.brand_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: brand delete POST");
});

// Display brand update form on GET.
exports.brand_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: brand update GET");
});

// Handle brand update on POST.
exports.brand_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: brand update POST");
});
