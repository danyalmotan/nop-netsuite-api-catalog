// data-proposed-additions.js — Proposed endpoint additions pending team approval
// Auto-extracted from monolithic HTML

// ============================================================
// PROPOSED ADDITIONS — Pending Team Approval
// These were generated from team feedback and are NOT yet part
// of the approved spec. They appear in a visually distinct
// section for team review.
// ============================================================
const proposedAdditions = [

  // ==========================================================
  // PROPOSAL 1: IMAGE URL EXPORT FOR NETSUITE PUSHBACK
  // Feedback: "Images loaded on nopCommerce and pushback
  // thumbnail images to relevant product on NetSuite"
  // ==========================================================
  {
    key: "proposed-image-url-export",
    title: "Image URL export (thumbnail pushback to NetSuite)",
    feedbackSource: "Yolanda — Image sync discussion (I still need more direction on this)",
    description: "Once images are loaded onto nopCommerce (from supplier feeds), NetSuite needs to pull resolved thumbnail URLs per product and per attribute combination. This enables NetSuite to display product thumbnails without storing full images. Images arrive from supplier feeds → loaded to nop → NetSuite calls this endpoint after item sync to get the image URLs.",
    rationale: "The existing GET /items/by-sku/{sku}/images returns picture metadata but does NOT return resolved, publicly-accessible thumbnail/full URLs per combination. NetSuite needs a dedicated endpoint that returns URL strings it can store as references.",
    endpoints: [
      {
        method: "GET",
        path: "/api/integration/v1/items/by-sku/{sku}/image-urls?thumbWidth={w}&thumbHeight={h}&includeFullSize={bool}&includeCombinations={bool}",
        direction: "nop → NetSuite (export/pull)",
        scope: "items.read",
        idempotencyRequired: false,
        approvalRequired: false,
        purpose: "Export resolved, publicly-accessible image URLs (thumbnails + full-size) for a product and all its attribute combinations. NetSuite calls this after an item sync to store thumbnail references. The server resolves Picture records into actual URLs using nop's IPictureService. Thumbnail dimensions are configurable via query params (defaults to site thumbnail settings). Combination images are resolved via ProductAttributeCombination.PictureId (4.60) or ProductAttributeCombinationPicture join table (4.90).",
        versionNotes: [
          "Thumbnail URLs are generated server-side via IPictureService.GetPictureUrlAsync() — respects nop's MediaSettings (CDN, virtual path, etc.).",
          "Default thumbnail size: 200×200 (configurable via thumbWidth/thumbHeight query params).",
          "includeCombinations defaults to true — returns per-variant images mapped by variant SKU.",
          "4.60: Combination images use ProductAttributeCombination.PictureId (single image per combination).",
          "4.90: Combination images use ProductAttributeCombinationPicture join table (multiple images per combination).",
          "If a combination has no dedicated image, it is omitted from the combinationImages array (NetSuite should fall back to product-level images).",
          "Full-size URLs are included when includeFullSize=true (default: true).",
          "This endpoint is read-only — no approval workflow, no idempotency required."
        ],
        fields: {
          "4.60": [
            { table: "Product", field: "SKU (from path)", required: true, type: "string" },
            { table: "(query param)", field: "thumbWidth", required: false, type: "int", notes: "Default: 200" },
            { table: "(query param)", field: "thumbHeight", required: false, type: "int", notes: "Default: 200" },
            { table: "(query param)", field: "includeFullSize", required: false, type: "bool", notes: "Default: true" },
            { table: "(query param)", field: "includeCombinations", required: false, type: "bool", notes: "Default: true" },
            { table: "Product_Picture_Mapping", field: "PictureId/DisplayOrder", required: false, notes: "Product-level images" },
            { table: "Picture", field: "Id/MimeType/SeoFilename/AltAttribute/TitleAttribute", required: false, notes: "Resolved to URLs" },
            { table: "ProductAttributeCombination", field: "PictureId", required: false, notes: "4.60: single FK per combination" },
            { table: "ProductAttributeCombination", field: "Sku", required: false, notes: "Variant SKU used as key" }
          ],
          "4.90": [
            { table: "Product", field: "Sku (from path)", required: true, type: "string" },
            { table: "(query param)", field: "thumbWidth", required: false, type: "int", notes: "Default: 200" },
            { table: "(query param)", field: "thumbHeight", required: false, type: "int", notes: "Default: 200" },
            { table: "(query param)", field: "includeFullSize", required: false, type: "bool", notes: "Default: true" },
            { table: "(query param)", field: "includeCombinations", required: false, type: "bool", notes: "Default: true" },
            { table: "Product_Picture_Mapping", field: "PictureId/DisplayOrder", required: false, notes: "Product-level images" },
            { table: "Picture", field: "Id/MimeType/SeoFilename/AltAttribute/TitleAttribute", required: false, notes: "Resolved to URLs" },
            { table: "ProductAttributeCombinationPicture", field: "ProductAttributeCombinationId/PictureId", required: false, notes: "4.90: many-to-many join table" },
            { table: "ProductAttributeCombination", field: "Sku", required: false, notes: "Variant SKU used as key" }
          ]
        },
        examplePayloads: {
          "4.60": {
            response: {
              comment: "200 OK — Product image URLs with combination thumbnails",
              body: JSON.stringify({
                success: true,
                data: {
                  sku: "GOLF-SHIRT-PREM",
                  productId: 101,
                  productImages: [
                    { pictureId: 501, displayOrder: 0, thumbnailUrl: "https://shop.example.com/images/thumbs/0000501_premium-golf-shirt_200.jpeg", fullUrl: "https://shop.example.com/images/thumbs/0000501_premium-golf-shirt.jpeg", altAttribute: "Premium Golf Shirt", mimeType: "image/jpeg" },
                    { pictureId: 502, displayOrder: 1, thumbnailUrl: "https://shop.example.com/images/thumbs/0000502_premium-golf-shirt-back_200.jpeg", fullUrl: "https://shop.example.com/images/thumbs/0000502_premium-golf-shirt-back.jpeg", altAttribute: "Premium Golf Shirt - Back", mimeType: "image/jpeg" }
                  ],
                  combinationImages: [
                    { variantSku: "GOLF-PREM-WHT-M", combinationId: 301, images: [{ pictureId: 501, thumbnailUrl: "https://shop.example.com/images/thumbs/0000501_premium-golf-shirt_200.jpeg", fullUrl: "https://shop.example.com/images/thumbs/0000501_premium-golf-shirt.jpeg" }] },
                    { variantSku: "GOLF-PREM-BLK-L", combinationId: 302, images: [{ pictureId: 503, thumbnailUrl: "https://shop.example.com/images/thumbs/0000503_golf-shirt-black_200.jpeg", fullUrl: "https://shop.example.com/images/thumbs/0000503_golf-shirt-black.jpeg" }] }
                  ]
                },
                correlationId: "img-url-a1b2c3d4"
              }, null, 2)
            }
          },
          "4.90": "same"
        }
      }
    ]
  },

  // ==========================================================
  // PROPOSAL 2: STORE MAPPING / WEBSITE ALLOCATION
  // Feedback: "NetSuite could include a field specifying which
  // website(s) a product should be published to"
  // ==========================================================
  {
    key: "proposed-store-mapping",
    title: "Store mapping (website/brand allocation)",
    feedbackSource: "Theresa Feedback — Website & brand allocation",
    description: "NetSuite needs to specify which nop store(s) a product should be published to. nopCommerce uses StoreMapping (entity-to-store relationship) to control visibility per store. Currently, the item upsert and full-sync endpoints do not expose store mapping. This proposal adds a dedicated sub-resource endpoint for managing product-to-store assignments, and also proposes an optional storeIds field on the full-sync composite endpoint.",
    rationale: "Each website operates with a distinct range and merchandising strategy. Without store mapping via the API, products would need manual store assignment in admin — defeating the purpose of automated sync. For key brands (e.g. Carol Boyes), middleware can cascade rules to auto-assign store mappings based on brand/manufacturer.",
    endpoints: [
      {
        method: "GET",
        path: "/api/integration/v1/items/by-sku/{sku}/store-mappings",
        direction: "nop → middleware (pull)",
        scope: "items.read",
        idempotencyRequired: false,
        approvalRequired: false,
        purpose: "Get all store assignments for a product by SKU. Returns which stores the product is visible on. If LimitedToStores is false, the product is visible on all stores (returned as a flag).",
        versionNotes: ["StoreMapping table is consistent across 4.60 and 4.90. EntityName='Product'."],
        fields: {
          "4.60": [
            { table: "Product", field: "SKU (from path)", required: true },
            { table: "Product", field: "LimitedToStores", required: true, notes: "If false, product is visible on ALL stores" },
            { table: "StoreMapping", field: "EntityId", required: false },
            { table: "StoreMapping", field: "EntityName (=Product)", required: false },
            { table: "StoreMapping", field: "StoreId", required: false },
            { table: "Store", field: "Name (joined)", required: false }
          ],
          "4.90": [
            { table: "Product", field: "Sku (from path)", required: true },
            { table: "Product", field: "LimitedToStores", required: true, notes: "If false, product is visible on ALL stores" },
            { table: "StoreMapping", field: "EntityId", required: false },
            { table: "StoreMapping", field: "EntityName (=Product)", required: false },
            { table: "StoreMapping", field: "StoreId", required: false },
            { table: "Store", field: "Name (joined)", required: false }
          ]
        }
      },
      {
        method: "PUT",
        path: "/api/integration/v1/items/by-sku/{sku}/store-mappings",
        direction: "NetSuite → nop (push/upsert)",
        scope: "items.write",
        idempotencyRequired: true,
        idempotencyRecipe: "NS:ItemStore:{externalItemId}:{storeSetHash}:{lastModifiedUtc}",
        approvalRequired: true,
        purpose: "Set store assignments for a product by SKU. Mode: REPLACE (remove all existing StoreMapping rows then assign) or MERGE (add missing, keep existing). Sets Product.LimitedToStores = true and creates StoreMapping rows. To make a product visible on ALL stores, send { \"allStores\": true } which sets LimitedToStores = false and removes all StoreMapping rows.",
        versionNotes: [
          "If allStores is true, sets LimitedToStores=false and removes existing StoreMapping rows for this product.",
          "If allStores is false/omitted, sets LimitedToStores=true and manages StoreMapping rows.",
          "Store resolution: accepts storeId (int) or storeName (string, case-insensitive match). storeName is resolved to StoreId internally.",
          "For brand-based auto-assignment, middleware should determine the target stores and pass them here.",
          "If approval enabled, stages in Acgs_PendingChange."
        ],
        fields: {
          "4.60": [
            { table: "Product", field: "SKU (from path)", required: true, type: "string" },
            { table: "(request body)", field: "allStores", required: false, type: "bool", notes: "If true, sets LimitedToStores=false (visible everywhere)" },
            { table: "(request body)", field: "mode", required: false, type: "string", notes: "'REPLACE' (default) or 'MERGE'" },
            { table: "(request body)", field: "stores", required: false, type: "object[]", notes: "Array of store assignments; required if allStores is false" },
            { table: "stores[]", field: "storeId", required: false, type: "int", notes: "Nop Store.Id — provide storeId OR storeName" },
            { table: "stores[]", field: "storeName", required: false, type: "string", notes: "Store.Name — server resolves to StoreId" },
            { table: "Acgs_PendingChange", field: "(staged if approval enabled)", required: false }
          ],
          "4.90": [
            { table: "Product", field: "Sku (from path)", required: true, type: "string" },
            { table: "(request body)", field: "allStores", required: false, type: "bool", notes: "If true, sets LimitedToStores=false (visible everywhere)" },
            { table: "(request body)", field: "mode", required: false, type: "string", notes: "'REPLACE' (default) or 'MERGE'" },
            { table: "(request body)", field: "stores", required: false, type: "object[]", notes: "Array of store assignments; required if allStores is false" },
            { table: "stores[]", field: "storeId", required: false, type: "int", notes: "Nop Store.Id — provide storeId OR storeName" },
            { table: "stores[]", field: "storeName", required: false, type: "string", notes: "Store.Name — server resolves to StoreId" },
            { table: "Acgs_PendingChange", field: "(staged if approval enabled)", required: false }
          ]
        }
      }
    ]
  },

  // ==========================================================
  // PROPOSAL 3: PRODUCT TAGS (RIBBONS)
  // Feedback: "Automate ribbon allocation... Recyclable, PET,
  // WSL could be triggered by structured product attributes"
  // ==========================================================
  {
    key: "proposed-product-tags",
    title: "Product tags (ribbons / badges)",
    feedbackSource: "Theresa Feedback — Ribbon automation",
    description: "Product tags in nopCommerce (Product_ProductTag_Mapping + ProductTag) drive frontend ribbon/badge display (e.g. 'Recyclable', 'PET', 'WSL', 'New Arrival'). NetSuite or middleware needs to push tag assignments so ribbons appear automatically. The automation logic (e.g. keyword → ribbon mapping) belongs in middleware — this endpoint just accepts the resulting tags. Note: Product tags are simple string labels — they differ from specification attributes (structured key-value pairs for filtering) and product attributes (variant-defining attributes like Color/Size).",
    rationale: "Currently, ribbons require manual administration in nop admin. If NetSuite can flag products (e.g. WSL items, recyclable materials), middleware can map those flags to nop product tags, eliminating manual ribbon management and improving consistency.",
    endpoints: [
      {
        method: "GET",
        path: "/api/integration/v1/items/by-sku/{sku}/tags",
        direction: "nop → middleware (pull)",
        scope: "items.read",
        idempotencyRequired: false,
        approvalRequired: false,
        purpose: "Get all product tag assignments for a product by SKU. Returns tag names and IDs from Product_ProductTag_Mapping.",
        versionNotes: ["ProductTag and Product_ProductTag_Mapping tables are consistent across 4.60 and 4.90."],
        fields: {
          "4.60": [
            { table: "Product", field: "SKU (from path)", required: true },
            { table: "Product_ProductTag_Mapping", field: "Product_Id/ProductTag_Id", required: false },
            { table: "ProductTag", field: "Id/Name", required: false }
          ],
          "4.90": [
            { table: "Product", field: "Sku (from path)", required: true },
            { table: "Product_ProductTag_Mapping", field: "Product_Id/ProductTag_Id", required: false },
            { table: "ProductTag", field: "Id/Name", required: false }
          ]
        }
      },
      {
        method: "PUT",
        path: "/api/integration/v1/items/by-sku/{sku}/tags",
        direction: "NetSuite/middleware → nop (push/upsert)",
        scope: "items.write",
        idempotencyRequired: true,
        idempotencyRecipe: "NS:ItemTag:{externalItemId}:{tagSetHash}:{lastModifiedUtc}",
        approvalRequired: true,
        purpose: "Set product tag assignments for a product by SKU. Mode: REPLACE (remove all existing tags then assign) or MERGE (add missing, keep existing). Tags are resolved by name — if a tag does not exist, the server creates it. Used to automate ribbon/badge assignment (e.g. 'Recyclable', 'WSL', 'PET').",
        versionNotes: [
          "Tag names are case-insensitive for matching. Server creates new ProductTag records for unknown names.",
          "REPLACE mode removes all existing Product_ProductTag_Mapping rows for this product, then assigns the new set.",
          "MERGE mode only adds tags that are not already assigned — does not remove existing ones.",
          "If approval enabled, stages in Acgs_PendingChange."
        ],
        fields: {
          "4.60": [
            { table: "Product", field: "SKU (from path)", required: true, type: "string" },
            { table: "(request body)", field: "mode", required: false, type: "string", notes: "'REPLACE' (default) or 'MERGE'" },
            { table: "(request body)", field: "tags", required: true, type: "string[]", notes: "Array of tag names e.g. ['Recyclable', 'WSL', 'PET']" },
            { table: "Acgs_PendingChange", field: "(staged if approval enabled)", required: false }
          ],
          "4.90": [
            { table: "Product", field: "Sku (from path)", required: true, type: "string" },
            { table: "(request body)", field: "mode", required: false, type: "string", notes: "'REPLACE' (default) or 'MERGE'" },
            { table: "(request body)", field: "tags", required: true, type: "string[]", notes: "Array of tag names e.g. ['Recyclable', 'WSL', 'PET']" },
            { table: "Acgs_PendingChange", field: "(staged if approval enabled)", required: false }
          ]
        }
      }
    ]
  },

  // ==========================================================
  // PROPOSAL 4: SPECIFICATION ATTRIBUTES
  // Feedback: Related to ribbon automation — structured
  // key-value pairs for display and filtering
  // ==========================================================
  {
    key: "proposed-specification-attributes",
    title: "Specification attributes",
    feedbackSource: "Theresa Feedback — Ribbon automation / structured data",
    description: "Specification attributes in nopCommerce (Product_SpecificationAttribute_Mapping + SpecificationAttribute + SpecificationAttributeOption) provide structured key-value product metadata used for frontend filtering and display (e.g. 'Material: Recycled PET', 'Certification: FSC'). These differ from product attributes (which define variants) and product tags (which are simple labels). NetSuite or middleware can push spec attributes to enrich product listings without manual data entry.",
    rationale: "Spec attributes drive the filtering sidebar on category pages and enrich product detail pages. They can also be used to trigger ribbons/badges via theme customisation. Currently these must be set manually in nop admin.",
    endpoints: [
      {
        method: "GET",
        path: "/api/integration/v1/items/by-sku/{sku}/specifications",
        direction: "nop → middleware (pull)",
        scope: "items.read",
        idempotencyRequired: false,
        approvalRequired: false,
        purpose: "Get all specification attribute assignments for a product by SKU. Returns spec attribute names, option values, and display settings.",
        versionNotes: ["SpecificationAttribute / SpecificationAttributeOption / Product_SpecificationAttribute_Mapping tables are consistent across 4.60 and 4.90."],
        fields: {
          "4.60": [
            { table: "Product", field: "SKU (from path)", required: true },
            { table: "Product_SpecificationAttribute_Mapping", field: "ProductId/SpecificationAttributeOptionId/AllowFiltering/ShowOnProductPage/DisplayOrder", required: false },
            { table: "SpecificationAttributeOption", field: "Id/Name/DisplayOrder/ColorSquaresRgb", required: false },
            { table: "SpecificationAttribute", field: "Id/Name/DisplayOrder", required: false }
          ],
          "4.90": [
            { table: "Product", field: "Sku (from path)", required: true },
            { table: "Product_SpecificationAttribute_Mapping", field: "ProductId/SpecificationAttributeOptionId/AllowFiltering/ShowOnProductPage/DisplayOrder", required: false },
            { table: "SpecificationAttributeOption", field: "Id/Name/DisplayOrder/ColorSquaresRgb", required: false },
            { table: "SpecificationAttribute", field: "Id/Name/DisplayOrder", required: false }
          ]
        }
      },
      {
        method: "PUT",
        path: "/api/integration/v1/items/by-sku/{sku}/specifications",
        direction: "NetSuite/middleware → nop (push/upsert)",
        scope: "items.write",
        idempotencyRequired: true,
        idempotencyRecipe: "NS:ItemSpec:{externalItemId}:{specSetHash}:{lastModifiedUtc}",
        approvalRequired: true,
        purpose: "Set specification attribute assignments for a product by SKU. Mode: REPLACE or MERGE. Server resolves spec attribute names and option values — creates missing SpecificationAttribute and SpecificationAttributeOption records if not found.",
        versionNotes: [
          "Each entry specifies: specAttributeName (resolved to SpecificationAttributeId), optionValue (resolved to SpecificationAttributeOptionId), allowFiltering, showOnProductPage, displayOrder.",
          "If a SpecificationAttribute with the given name does not exist, the server creates it.",
          "If a SpecificationAttributeOption with the given value does not exist under that attribute, the server creates it.",
          "If approval enabled, stages in Acgs_PendingChange."
        ],
        fields: {
          "4.60": [
            { table: "Product", field: "SKU (from path)", required: true, type: "string" },
            { table: "(request body)", field: "mode", required: false, type: "string", notes: "'REPLACE' (default) or 'MERGE'" },
            { table: "(request body)", field: "specifications", required: true, type: "object[]", notes: "Array of spec attribute assignments" },
            { table: "specifications[]", field: "attributeName", required: true, type: "string", notes: "e.g. 'Material', 'Certification'; server resolves/creates" },
            { table: "specifications[]", field: "optionValue", required: true, type: "string", notes: "e.g. 'Recycled PET', 'FSC'; server resolves/creates" },
            { table: "specifications[]", field: "allowFiltering", required: false, type: "bool", notes: "Default: true — allows sidebar filtering" },
            { table: "specifications[]", field: "showOnProductPage", required: false, type: "bool", notes: "Default: true — shows in spec table on product page" },
            { table: "specifications[]", field: "displayOrder", required: false, type: "int" },
            { table: "Acgs_PendingChange", field: "(staged if approval enabled)", required: false }
          ],
          "4.90": [
            { table: "Product", field: "Sku (from path)", required: true, type: "string" },
            { table: "(request body)", field: "mode", required: false, type: "string", notes: "'REPLACE' (default) or 'MERGE'" },
            { table: "(request body)", field: "specifications", required: true, type: "object[]", notes: "Array of spec attribute assignments" },
            { table: "specifications[]", field: "attributeName", required: true, type: "string", notes: "e.g. 'Material', 'Certification'; server resolves/creates" },
            { table: "specifications[]", field: "optionValue", required: true, type: "string", notes: "e.g. 'Recycled PET', 'FSC'; server resolves/creates" },
            { table: "specifications[]", field: "allowFiltering", required: false, type: "bool", notes: "Default: true — allows sidebar filtering" },
            { table: "specifications[]", field: "showOnProductPage", required: false, type: "bool", notes: "Default: true — shows in spec table on product page" },
            { table: "specifications[]", field: "displayOrder", required: false, type: "int" },
            { table: "Acgs_PendingChange", field: "(staged if approval enabled)", required: false }
          ]
        }
      }
    ]
  },

  // ==========================================================
  // PROPOSAL 5: DEFAULT PUBLISHED STATE + PUBLISHING CONTROLS
  // Feedback: "Automatic publishing does raise quality concerns"
  // "Dual approval before publishing remains essential"
  // ==========================================================
  {
    key: "proposed-publishing-controls",
    title: "Publishing controls & defaults",
    feedbackSource: "Theresa Feedback — Publishing controls & capacity",
    description: "This proposal adds a configurable default for the Published state when products are created via the API, and strengthens the approval workflow to support a separate publish-approval step. Currently, if a product upsert includes published: true and approval is disabled, the product goes live immediately. This is a risk when products require editing, enrichment, image checks, and description formatting before going live. This proposal covers: (1) a plugin setting DefaultPublishedStateOnCreate (default: false), (2) documentation that dual-approval is supported, and (3) a dedicated publish/unpublish endpoint.",
    rationale: "Product management currently accounts for ~70-80% of daily workload. A large portion of products require editing before going live. Auto-publishing risks rushed or inconsistent listings. The default should be unpublished, with explicit publish actions requiring approval.",
    endpoints: [
      {
        method: "POST",
        path: "/api/integration/v1/items/by-sku/{sku}/publish",
        direction: "admin / internal",
        scope: "items.write",
        idempotencyRequired: true,
        idempotencyRecipe: "NS:Publish:{sku}:{publishedState}:{utcNow}",
        approvalRequired: true,
        purpose: "Explicitly publish or unpublish a product by SKU. This is the recommended way to control product visibility after creation — separate from the data upsert. When approval is enabled, this creates a dedicated PUBLISH-type Acgs_PendingChange that only changes the Published field, making it easy for approvers to distinguish data changes from publish decisions. Supports a 'reason' field for audit trail (e.g. 'Images approved, descriptions checked by merchandising').",
        versionNotes: [
          "This is a separate action from the product upsert — it only changes Product.Published.",
          "When approval is enabled, creates an Acgs_PendingChange with EntityType='ProductPublish' — distinct from 'Product' changes.",
          "This supports dual-approval workflows: one approval for data changes, a separate approval for publishing.",
          "The plugin setting DefaultPublishedStateOnCreate (default: false) means all new products created via API start as unpublished.",
          "To override the default on creation, explicitly include published: true in the upsert — but this will be staged for approval if approval is enabled.",
          "The reason field is stored in Acgs_PendingChange.ReviewNotes for audit trail."
        ],
        fields: {
          "4.60": [
            { table: "Product", field: "SKU (from path)", required: true, type: "string" },
            { table: "(request body)", field: "published", required: true, type: "bool", notes: "true = publish, false = unpublish" },
            { table: "(request body)", field: "reason", required: false, type: "string", notes: "Audit trail reason e.g. 'Approved by merchandising team'" },
            { table: "Product", field: "Published", required: true, notes: "Updated on approval" },
            { table: "Acgs_PendingChange", field: "EntityType='ProductPublish'", required: false, notes: "Separate from data changes for dual-approval" }
          ],
          "4.90": [
            { table: "Product", field: "Sku (from path)", required: true, type: "string" },
            { table: "(request body)", field: "published", required: true, type: "bool", notes: "true = publish, false = unpublish" },
            { table: "(request body)", field: "reason", required: false, type: "string", notes: "Audit trail reason e.g. 'Approved by merchandising team'" },
            { table: "Product", field: "Published", required: true, notes: "Updated on approval" },
            { table: "Acgs_PendingChange", field: "EntityType='ProductPublish'", required: false, notes: "Separate from data changes for dual-approval" }
          ]
        }
      }
    ]
  },

  // ==========================================================
  // PROPOSAL 6: PRODUCT PLACEMENT (DISPLAY ORDER HELPER)
  // Feedback: "A structured field such as 'Place After
  // Product/SKU' could assist with more controlled placement"
  // ==========================================================
  {
    key: "proposed-display-order",
    title: "Product placement (display order orchestration)",
    feedbackSource: "Theresa Feedback — Product placement",
    description: "This is a documentation/pattern proposal rather than a new endpoint. The existing category mapping endpoint already supports displayOrder. However, the team requested a 'Place After Product/SKU' concept for more controlled placement. This is best handled as a middleware orchestration pattern: (1) Call GET /items/by-sku/{targetSku}/categories to get the target product's display order, (2) Set the new product's display order to target + 1, (3) Optionally bump subsequent products. The API itself does not need a new endpoint — this section documents the recommended pattern.",
    rationale: "Display order is already available on category mappings. The 'place after SKU' logic is business orchestration that belongs in middleware, not in the API itself. Documenting this pattern helps the team understand how to achieve controlled placement.",
    endpoints: [
      {
        method: "PUT",
        path: "/api/integration/v1/items/by-sku/{sku}/categories (existing — enhanced documentation)",
        direction: "NetSuite → nop (push/upsert)",
        scope: "items.write",
        idempotencyRequired: true,
        idempotencyRecipe: "NS:ItemCat:{externalItemId}:{categorySetHash}:{lastModifiedUtc}",
        approvalRequired: true,
        purpose: "[EXISTING ENDPOINT — enhanced documentation] The existing PUT /items/by-sku/{sku}/categories endpoint already supports displayOrder per category assignment. For 'Place After SKU' behaviour, middleware should: (1) GET /items/by-sku/{targetSku}/categories to read the target's displayOrder per category, (2) Set the new product's displayOrder = target.displayOrder + 1 in the PUT request, (3) Optionally fetch other products in the same category and increment their displayOrder if they would collide. This pattern avoids adding complexity to the API while supporting controlled placement.",
        versionNotes: [
          "This is NOT a new endpoint — it documents a middleware orchestration pattern using existing endpoints.",
          "The displayOrder field on categories[] already supports this use case.",
          "Middleware should handle the 'place after' logic because it involves reading current state and computing new values — server-side would require a transaction lock on the entire category's products.",
          "For procurement ticket placement requirements, middleware can read the ticket's 'place after' instruction, resolve it to a displayOrder value, and include it in the category assignment payload."
        ],
        fields: { "4.60": [], "4.90": [] }
      }
    ]
  },

  // ==========================================================
  // PROPOSAL 7: FULL-SYNC ENHANCEMENTS
  // Enhancement to existing full-sync to include storeMappings
  // and tags from the above proposals
  // ==========================================================
  {
    key: "proposed-full-sync-enhancements",
    title: "Full-sync composite — proposed field additions",
    feedbackSource: "Combined feedback — store mapping + tags + specs",
    description: "If Proposals 2, 3, and 4 are approved, the existing PUT /items/by-sku/{sku}/full-sync composite endpoint should be enhanced to also accept storeMappings, tags, and specifications in the same atomic payload. This avoids requiring separate API calls after full-sync for these common fields. This proposal does NOT create a new endpoint — it adds optional fields to the existing full-sync schema.",
    rationale: "The full-sync endpoint is the recommended way to create complete products in one call. If store mappings, tags, and spec attributes are managed via API, they should be includable in the composite payload for atomic creation.",
    endpoints: [
      {
        method: "PUT",
        path: "/api/integration/v1/items/by-sku/{sku}/full-sync (existing — proposed new fields)",
        direction: "NetSuite → nop (push/composite atomic)",
        scope: "items.write",
        idempotencyRequired: true,
        idempotencyRecipe: "NS:FullSync:{externalItemId}:{payloadHash}:{lastModifiedUtc}",
        approvalRequired: true,
        purpose: "[EXISTING ENDPOINT — proposed new optional fields] Add the following optional fields to the existing full-sync request schema: (1) storeMappings — array of store assignments or allStores flag, (2) tags — array of tag name strings for ribbon/badge assignment, (3) specifications — array of spec attribute assignments. These would execute within the same DB transaction as all other full-sync operations. Server execution order would add: step 12) StoreMapping upsert, step 13) ProductTag upsert, step 14) Product_SpecificationAttribute_Mapping upsert.",
        versionNotes: [
          "These are OPTIONAL additions to the existing full-sync schema — no breaking changes.",
          "If storeMappings is omitted, product inherits the default store visibility (existing behaviour).",
          "If tags is omitted, no product tags are assigned (existing behaviour).",
          "If specifications is omitted, no spec attributes are assigned (existing behaviour).",
          "All new fields follow the same schemas as their dedicated sub-resource endpoints (Proposals 2, 3, 4)."
        ],
        fields: {
          "4.60": [
            { table: "(request body)", field: "storeMappings", required: false, type: "object", notes: "PROPOSED: { allStores: bool, stores: [{storeId, storeName}] }" },
            { table: "(request body)", field: "tags", required: false, type: "string[]", notes: "PROPOSED: Array of tag names e.g. ['Recyclable', 'WSL']" },
            { table: "(request body)", field: "specifications", required: false, type: "object[]", notes: "PROPOSED: Array of {attributeName, optionValue, allowFiltering, showOnProductPage, displayOrder}" }
          ],
          "4.90": [
            { table: "(request body)", field: "storeMappings", required: false, type: "object", notes: "PROPOSED: { allStores: bool, stores: [{storeId, storeName}] }" },
            { table: "(request body)", field: "tags", required: false, type: "string[]", notes: "PROPOSED: Array of tag names e.g. ['Recyclable', 'WSL']" },
            { table: "(request body)", field: "specifications", required: false, type: "object[]", notes: "PROPOSED: Array of {attributeName, optionValue, allowFiltering, showOnProductPage, displayOrder}" }
          ]
        }
      }
    ]
  }

];