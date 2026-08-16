/* KORDIA 2026 site behaviour.
   Screens are hash-routed so the browser back button works, which the design
   comp's screen-picker prototype could not do. */
(() => {
  "use strict";

  const catalog = window.KORDIA_CATALOG;
  if (!catalog || !Array.isArray(catalog.products)) {
    document.body.innerHTML = "<p style='padding:60px;font-family:sans-serif'>Catalog data could not be loaded.</p>";
    return;
  }

  const WA = "8613450846180";
  const PAGE_SIZE = 24;

  /* ------------------------------------------------------------------ i18n */
  const T = {
    en: {
      skip: "Skip to content",
      introSub: "Outdoor Furniture · Foshan, China",
      navCollections: "Collections", navFactory: "Factory", navMaterials: "Materials",
      navShipping: "Shipping", navContact: "Contact", navProjects: "Projects", menu: "Menu",

      projectsKicker: "Installed and in use",
      projectsTitle: "Where our furniture ends up.",
      projectsTeaseTitle: "Hotels, resorts and terraces already furnished.",
      projectsIntro: "Seafront suites, rooftop restaurants, resort pool decks and private terraces — photographed after installation by the buyers who specified them.",
      seeAllProjects: "See all projects →",
      projectsCtaTitle: "Specifying for a project?",
      projectsCtaBody: "Send the drawings, the mood board or a photo of what you have in mind. We quote hospitality and contract volumes directly.",
      capSeaside: "Seafront hotel suite · balcony bistro seating",
      capCourtyard: "Hotel courtyard · market parasol over curved bench seating",
      capWaterside: "Overwater dining terrace · rattan-look bistro chair",
      capParasols: "Beach club roof terrace · scalloped market parasols",
      capRooftop: "Rooftop restaurant · cantilever parasols and rope dining",
      capLakeside: "Private lakeside terrace · rope lounge set",
      capResortPool: "Resort pool deck · sun loungers and parasols",
      subHospitality: "Hospitality", subResidential: "Residential", subRestaurant: "Restaurant & café",
      altFactoryFloor: "KORDIA aluminium fabrication floor in Chancheng, Foshan",
      altFactoryYard: "Finished teak loungers in the KORDIA factory yard",
      altFactoryTeak: "Solid teak chair frames on the KORDIA assembly floor",
      capTeakWorkshop: "Teak frame assembly · Chancheng, Foshan",
      close: "Close",

      selection: "Selection", getQuote: "Get a Quote", chat: "Chat", chatAria: "Chat on WhatsApp",
      crumbHome: "Home",

      heroTitle: "Built for<em>outdoor lifestyle.</em>",
      heroBody: "500+ models of rope-weave, cast-aluminium and teak — sofas, dining, shade and outdoor kitchens — manufactured in Foshan, shipped to 40+ countries.",
      statModels: "Models", statCategories: "Categories", statCountries: "Countries",
      exploreCollections: "Explore Collections", requestCatalog: "Request the 2026 Catalog",
      whatsappChat: "WhatsApp Chat",

      programmeKicker: "The 2026 programme",
      programmeTitle: "A complete outdoor programme, from one factory floor.",
      programmeBody: "Six collections that furnish an entire terrace — seating, dining, shade, fire and landscape — so you consolidate a container instead of chasing six suppliers.",

      whyKicker: "Why KORDIA", whyTitle: "Capability, not taste.",
      whyBody: "Four things a buyer needs to know before the first sample order.",
      insideFactory: "Inside the factory →",
      point1Title: "No trading margin.",
      point1Body: "You are buying from the production line in Chancheng, Foshan — the same line that supplies European and Middle Eastern importers. One point of contact from quotation through loading.",
      point2Title: "Built for weather, not showrooms.",
      point2Body: "Powder-coated 6063 aluminium frames, UV-stable olefin rope, solid teak and quick-dry foam. Specify the frame finish, the rope colour and the fabric — we hold the stock. <span class=\"verify\">[confirm alloy + rope spec]</span>",
      point3Title: "Your brand on the label.",
      point3Body: "Custom colourways, exclusive dimensions, neutral or branded packaging, and logo application on planters and structures. Tooling for exclusive models on request.",
      point4Title: "Loaded and inspected.",
      point4Body: "Container loading plans, CBM per SKU, and pre-shipment inspection on every order. FOB Guangzhou / Shenzhen, CIF and DDP on request. <span class=\"verify\">[confirm ports and Incoterms]</span>",
      matRope: "Olefin rope weave", matAlu: "Powder-coated aluminium", matTeak: "Solid teak",
      materialsCare: "Materials & care →", materialsCareShort: "Materials & care",

      catalogBandTitle: "The 2026 catalog. 140 pages, 500+ models.",
      catalogBandBody: "Full product line with model numbers, dimensions and finishes. Tell us your market and we'll send the sections that matter to you.",
      photoQuoteTitle: "Send us a photo.<em>We'll quote it.</em>",
      photoQuoteBody: "A catalog page, a Pinterest screenshot, a competitor's product — send what you have and our team will come back within 24 hours with specification and pricing.",
      startInquiry: "Start your inquiry",

      collectionsIntro: "Six collections, twenty-two categories, one production floor. Every model can be re-specified in your frame finish, rope colour and fabric.",
      enterCollection: "Enter collection", photos: "photographs", photosShort: "photographs",

      filter: "Filter", searchLabel: "Search", searchPlaceholder: "Reference or category",
      collection: "Collection", category: "Category", clearFilters: "Clear all filters",
      allCollections: "All collections", allCategories: "All categories",
      sort: "Sort", sortCatalog: "Catalog order", sortReverse: "Catalog order, reversed", sortCategory: "Category",
      noResults: "No models match these filters.",
      showing: "Showing {shown} of {total} photographs",
      loadMore: "Load {n} more",
      customQuote: "Custom quote", add: "Add", added: "Added",

      frameFinish: "Frame finish", ropeColour: "Rope colour", selected: "Selected",
      moqLine: "Quotation within 24 hours · MOQ confirmed per model <span class=\"verify\">[verify]</span>",
      addToSelection: "Add to selection", inSelection: "✓ In your selection",
      inquireModel: "Inquire about this model", askOnWhatsApp: "Ask on WhatsApp",
      specifications: "Specifications",
      specNote: "Dimensions, weights and packing data are confirmed per order — tell us the model and we'll send the full spec sheet.",
      oemTitle: "OEM & private label", oem: "OEM",
      oemBody: "Custom dimensions, exclusive colourways and private-label packaging available on this model.",
      sampling: "Sampling",
      samplingBody: "Samples can be produced in your specified finish before a production order. Lead time and sample cost are quoted with the model.",
      relatedModels: "Related models", allInCategory: "All {name} →",
      specCatalogRef: "Catalog reference", specCollection: "Collection", specCategory: "Category",
      specCatalogPage: "Catalog page", specSource: "Photography", specSourceValue: "2026 printed catalog",
      specLead: "Lead time", specLeadValue: "Quoted per order [verify]",
      specMoq: "MOQ", specMoqValue: "Confirmed per model [verify]",
      specModel: "Factory model", specDimensions: "Dimensions",
      specDimsPending: "On request — not published in the factory quote book",

      navSignature: "Signature", navSettings: "Browse by Setting",
      sigKicker: "The house line",
      sigTitle: "KORDIA<em>Signature.</em>",
      sigLede: "A single designed programme — teak, rope and cast aluminium drawn as one family, so a terrace reads as one idea rather than six catalogue pages.",
      sigStoryKicker: "Why it exists",
      sigStoryTitle: "One family, not a catalogue.",
      sigStoryBody: "The trade catalogue answers \"what do you make?\". Signature answers \"what would you specify?\". Every piece shares a frame language, a rope gauge and a cushion tone, so an importer can furnish a whole space from one page and know it will arrive matching.",
      sigDisclosure: "Signature imagery is computer-rendered. Production samples are photographed on request — ask us before you specify a finish.",
      sigToCatalogue: "See the full 2026 catalogue →",
      setKicker: "Where it goes",
      setTitle: "Start from the space, not the product.",
      setIntro: "Most buyers arrive with a place in mind — a hotel poolside, a restaurant terrace, a municipal park — rather than a product category. Each setting below opens the models that suit it.",
      setCount: "{n} models",
      projKicker: "Where it ships",
      projTitle: "Hotels, terraces, public parks.",
      projBody: "KORDIA furniture leaves Foshan by the container for importers, hospitality groups and municipal contracts across 40+ countries.",
      projPending: "Installation photography to follow — awaiting project images from the client.",

      inquiryTitle: "Request a quotation",
      inquiryIntro: "Four steps, about two minutes. You don't need a model number — a reference photo is enough. Your progress is saved as you go.",
      step1Title: "Category & references", step2Title: "Requirements",
      step3Title: "Specification", step4Title: "Contact",
      stepCategory: "Category", stepRequirements: "Requirements", stepSpec: "Specification", stepContact: "Contact",
      whatSourcing: "What are you sourcing?",
      attachedModels: "Models attached from your selection",
      noneAttached: "No models attached yet — browse the collections and add the ones you like. You can also send a reference photo on WhatsApp instead.",
      attachedCount: "{n} models attached",
      qty: "Quantity (sets / pcs)", qtyPlaceholder: "e.g. 200 sets",
      market: "Target market / country", marketPlaceholder: "e.g. Germany",
      useCase: "Use case", useResidential: "Residential retail", useHotel: "Hotel / resort",
      useRestaurant: "Restaurant / café", usePublic: "Public / municipal",
      delivery: "Target delivery date", deliveryPlaceholder: "Month / year",
      port: "Port of destination", portPlaceholder: "e.g. Hamburg",
      incoterm: "Incoterm preference", notSure: "Not sure yet",
      ropeFabric: "Rope / fabric colour", ropePlaceholder: "e.g. terracotta rope, chalk fabric",
      packaging: "Packaging", packNeutral: "Neutral carton", packPrivate: "Private label", packRetail: "Retail-ready",
      customLogo: "Custom logo", logoNo: "No", logoFrame: "Yes — on frame",
      logoPack: "Yes — on packaging", logoPlanters: "Yes — on planters / structures",
      assembly: "Assembly", asmFlat: "Flat-pack (standard)", asmPre: "Pre-assembled", asmMixed: "Mixed",
      name: "Name", company: "Company", email: "Email", phone: "Phone / WhatsApp", message: "Message",
      phoneError: "Please add a phone or WhatsApp number so we can reach you.",
      nameError: "Please tell us your name.",
      back: "← Back", next: "Continue", send: "Send via WhatsApp",
      stepOf: "Step {n} of 4",
      inquiryReceived: "Inquiry ready", inquiryRef: "Reference {ref}",
      inquiryDoneBody: "We've opened WhatsApp with your inquiry attached. If the window didn't open, use the button below and the same details will be sent.",
      openWhatsApp: "Open WhatsApp",

      chancheng: "Chancheng, Foshan",
      factoryTitle: "A furniture factory, not a trading office.",
      factoryBody1: "KORDIA manufactures in Chancheng District, Foshan — the centre of China's outdoor furniture industry. Production covers rope weaving, aluminium tube fabrication, cast-aluminium casting, powder coating, cushion sewing and final assembly under one roof, which is why a custom colourway is quoted in 48 hours instead of 4 weeks.",
      factoryBody2: "We supply importers, hospitality groups and specifiers across Europe, the Middle East, North America and Australia. <span class=\"verify\">[verify export history]</span>",
      slotFactoryFloor: "Photography needed · factory floor, weaving line · 4:3",
      capability: "Capability", underOneRoof: "Under one roof",
      capabilityNote: "Bracketed figures are placeholders — replace with confirmed numbers from Fianna before launch.",
      requestQuote: "Request a quote",

      materialsKicker: "Materials, finishes & care",
      materialsTitle: "What it's made of, and how it holds up.",
      materialsIntro: "Five material families, the finishes we hold in stock, and the care instructions to pass on to your customer.",
      stockFinishes: "Stock frame finishes",
      ralNote: "Custom RAL matching available above MOQ. <span class=\"verify\">[confirm MOQ]</span>",
      care: "Care",

      shippingKicker: "Shipping, MOQ & lead times", shippingTitle: "From our floor to your port.",
      shippingIntro: "How orders are quoted, packed and loaded. Every figure below is confirmed against your actual order before you commit.",
      shippingMoq: "Shipping & MOQ",

      contactKicker: "Talk to us", contactTitle: "One contact, from quotation to loading.",
      contactIntro: "Fianna handles export enquiries directly. Send a catalog page, a photo or a project brief and you'll have a reply within 24 hours, including weekends.",
      whatsapp: "WhatsApp", wechat: "WeChat", address: "Address", hours: "Hours",
      addressValue: "Chancheng District, Foshan, Guangdong, China",
      hoursValue: "Mon–Sat, 09:00–18:00 (GMT+8)",
      chatOnWhatsApp: "Chat on WhatsApp",
      slotShowroom: "Photography needed · showroom or factory gate · 4:3",
      slotMap: "Map embed · Chancheng, Foshan",

      company_: "Company", forBuyers: "For buyers", browseAll: "Browse all models",
      footerAddress: "Chancheng, Foshan<br>Guangdong, China",
      footerWechat: "WeChat · +86 134 5084 6180",

      yourSelection: "Your selection", modelsSelected: "{n} models", modelsSelected_one: "1 model",
      attachedCount_one: "1 model attached",
      drawerEmpty: "No models selected yet. Add products as you browse and send them as one inquiry.",
      drawerNote: "Goes straight to step 4 — your models are already attached.",
      drawerCta: "Request a quote for these",
      remove: "Remove", sets: "sets",

      catalogRequestMessage: "Hello Fianna, please send me the KORDIA 2026 catalog. My market is:",
      heroChatMessage: "Hello Fianna, I'm interested in KORDIA outdoor furniture.",
      floatingChatMessage: "Hello Fianna, I'm viewing the KORDIA website.",
      productMessage: "Hello Fianna, I'd like more information about",
      inquiryGreeting: "Hello Fianna, I'd like a quotation from the KORDIA website.",
    },
    zh: {
      skip: "跳到主要内容",
      introSub: "户外家具 · 中国佛山",
      navCollections: "产品系列", navFactory: "工厂实力", navMaterials: "材质工艺",
      navShipping: "物流与起订量", navContact: "联系我们", navProjects: "工程案例", menu: "菜单",

      projectsKicker: "已交付并投入使用",
      projectsTitle: "我们的家具，最终落在这些地方。",
      projectsTeaseTitle: "已完成配套的酒店、度假村与露台。",
      projectsIntro: "海景客房、屋顶餐厅、度假村泳池区与私人露台——由采购方在安装完成后实地拍摄。",
      seeAllProjects: "查看全部案例 →",
      projectsCtaTitle: "正在为项目选型？",
      projectsCtaBody: "把图纸、意向图或参考照片发给我们。酒店工程与大宗采购均可直接报价。",
      capSeaside: "海景酒店客房 · 阳台咖啡桌椅",
      capCourtyard: "酒店中庭 · 中柱伞与弧形卡座",
      capWaterside: "临水用餐露台 · 藤编风格咖啡椅",
      capParasols: "海滨会所屋顶 · 花边中柱伞",
      capRooftop: "屋顶餐厅 · 悬臂伞与绳编餐椅",
      capLakeside: "私人湖景露台 · 绳编沙发组合",
      capResortPool: "度假村泳池区 · 沙滩椅与遮阳伞",
      subHospitality: "酒店工程", subResidential: "住宅项目", subRestaurant: "餐饮空间",
      altFactoryFloor: "KORDIA 佛山禅城铝材加工车间",
      altFactoryYard: "KORDIA 工厂堆场内的成品柚木躺椅",
      altFactoryTeak: "KORDIA 组装车间内的实心柚木椅架",
      capTeakWorkshop: "柚木椅架组装 · 广东佛山禅城",
      close: "关闭",

      selection: "已选产品", getQuote: "获取报价", chat: "咨询", chatAria: "通过 WhatsApp 咨询",
      crumbHome: "首页",

      heroTitle: "为户外生活<em>而造。</em>",
      heroBody: "500多款绳编、铸铝与柚木户外家具——沙发、餐桌、遮阳与户外厨房，佛山制造，出口全球40多个国家和地区。",
      statModels: "产品型号", statCategories: "产品类别", statCountries: "出口国家",
      exploreCollections: "浏览产品系列", requestCatalog: "索取2026产品目录",
      whatsappChat: "WhatsApp 咨询",

      programmeKicker: "2026 产品规划",
      programmeTitle: "一个工厂，一套完整的户外方案。",
      programmeBody: "六大系列覆盖整个户外空间——座椅、餐桌、遮阳、火焰与庭园，让您一柜集齐，而不必对接六家供应商。",

      whyKicker: "为什么选择 KORDIA", whyTitle: "看的是制造实力。",
      whyBody: "下单打样前，采购商最该了解的四件事。",
      insideFactory: "走进工厂 →",
      point1Title: "没有贸易商差价。",
      point1Body: "您直接对接佛山禅城的生产线——同一条线正在供应欧洲与中东的进口商。从报价到装柜，全程一个对接人。",
      point2Title: "为户外气候而造，而非展厅。",
      point2Body: "6063 铝合金喷粉框架、抗紫外线丙纶绳、实心柚木与速干海绵。框架颜色、绳编配色与面料均可指定，常备现货。<span class=\"verify\">[待确认：铝材与绳材料规格]</span>",
      point3Title: "贴您自己的品牌。",
      point3Body: "定制配色、专属尺寸、中性或品牌包装，花箱与建筑结构可做标识。专属模具亦可按需开发。",
      point4Title: "装柜与验货。",
      point4Body: "提供装柜方案、单款 CBM 数据，每单出货前均安排验货。支持广州／深圳 FOB，亦可 CIF 与 DDP。<span class=\"verify\">[待确认：港口与贸易条款]</span>",
      matRope: "丙纶绳编织", matAlu: "铝合金喷粉", matTeak: "实心柚木",
      materialsCare: "材质与保养 →", materialsCareShort: "材质与保养",

      catalogBandTitle: "2026 产品目录：140 页，500+ 款型。",
      catalogBandBody: "完整产品线，含型号、尺寸与表面处理。告诉我们您的目标市场，我们会发送最相关的章节。",
      photoQuoteTitle: "发张照片给我们，<em>我们来报价。</em>",
      photoQuoteBody: "一页目录、一张截图、一款竞品照片——把您手上的资料发来，我们会在 24 小时内回复规格与价格。",
      startInquiry: "开始询价",

      collectionsIntro: "六大系列，二十二个类别，同一条生产线。每一款都可按您指定的框架颜色、绳编配色与面料重新配置。",
      enterCollection: "进入系列", photos: "张产品图", photosShort: "张产品图",

      filter: "筛选", searchLabel: "搜索", searchPlaceholder: "编号或类别",
      collection: "产品系列", category: "产品类别", clearFilters: "清除全部筛选",
      allCollections: "全部系列", allCategories: "全部类别",
      sort: "排序", sortCatalog: "按目录顺序", sortReverse: "按目录倒序", sortCategory: "按类别",
      noResults: "没有符合筛选条件的产品。",
      showing: "显示 {total} 张中的 {shown} 张",
      loadMore: "再加载 {n} 张",
      customQuote: "定制报价", add: "加入", added: "已加入",

      frameFinish: "框架颜色", ropeColour: "绳编配色", selected: "已选",
      moqLine: "24 小时内回复报价 · 起订量按款确认 <span class=\"verify\">[待确认]</span>",
      addToSelection: "加入选品", inSelection: "✓ 已加入选品",
      inquireModel: "咨询此款", askOnWhatsApp: "WhatsApp 咨询",
      specifications: "产品参数",
      specNote: "尺寸、重量与装箱数据按订单确认——告诉我们款号，我们会发送完整规格表。",
      oemTitle: "OEM 与自有品牌", oem: "OEM",
      oemBody: "此款支持定制尺寸、专属配色与自有品牌包装。",
      sampling: "打样",
      samplingBody: "量产前可按您指定的配色打样，打样周期与费用随款报价。",
      relatedModels: "相关款式", allInCategory: "查看全部{name} →",
      specCatalogRef: "目录编号", specCollection: "产品系列", specCategory: "产品类别",
      specCatalogPage: "目录页码", specSource: "图片来源", specSourceValue: "2026 纸质目录",
      specLead: "交货周期", specLeadValue: "按订单报价 [待确认]",
      specMoq: "起订量", specMoqValue: "按款确认 [待确认]",
      specModel: "工厂型号", specDimensions: "尺寸",
      specDimsPending: "面议 — 报价册未列明",

      navSignature: "臻选系列", navSettings: "按场景选购",
      sigKicker: "自主设计系列",
      sigTitle: "KORDIA<em>臻选系列</em>",
      sigLede: "柚木、绳编与铸铝以同一设计语言绘制，整个露台呈现为一个完整构想，而非六页目录的拼凑。",
      sigStoryKicker: "系列缘起",
      sigStoryTitle: "一个家族，而非一本目录。",
      sigStoryBody: "贸易目录回答「我们能做什么」，臻选系列回答「我们会如何指定」。每件产品共享同一框架语言、绳径与坐垫色调，采购商可在一页之内完成整个空间的配置，并确信到货时彼此相配。",
      sigDisclosure: "臻选系列图片为电脑渲染图。量产样品可应要求实拍 — 指定饰面前请先与我们确认。",
      sigToCatalogue: "查看 2026 完整目录 →",
      setKicker: "适用场景",
      setTitle: "从空间出发，而非从产品出发。",
      setIntro: "多数买家心中先有一个场所 — 酒店泳池、餐厅露台、市政公园 — 而非产品类别。以下每个场景将打开适配的款式。",
      setCount: "{n} 款",
      projKicker: "销往何处",
      projTitle: "酒店、露台、公共园区。",
      projBody: "KORDIA 家具自佛山整柜发运，服务 40 多个国家的进口商、酒店集团与市政项目。",
      projPending: "实景照片待补 — 正在等待客户提供项目图片。",

      inquiryTitle: "索取报价",
      inquiryIntro: "四个步骤，约两分钟。无需款号——一张参考图即可。填写进度会自动保存。",
      step1Title: "类别与参考", step2Title: "采购需求",
      step3Title: "规格要求", step4Title: "联系方式",
      stepCategory: "类别", stepRequirements: "需求", stepSpec: "规格", stepContact: "联系",
      whatSourcing: "您想采购哪类产品？",
      attachedModels: "已从选品中附加的款式",
      noneAttached: "尚未附加任何款式——浏览产品系列并加入您感兴趣的款式。您也可以直接通过 WhatsApp 发送参考图。",
      attachedCount: "已附加 {n} 款",
      qty: "数量（套／件）", qtyPlaceholder: "例如：200 套",
      market: "目标市场／国家", marketPlaceholder: "例如：德国",
      useCase: "使用场景", useResidential: "家用零售", useHotel: "酒店／度假村",
      useRestaurant: "餐厅／咖啡厅", usePublic: "公共／市政",
      delivery: "期望交货时间", deliveryPlaceholder: "月份／年份",
      port: "目的港", portPlaceholder: "例如：汉堡",
      incoterm: "贸易条款", notSure: "尚未确定",
      ropeFabric: "绳编／面料配色", ropePlaceholder: "例如：陶土色绳编，米白面料",
      packaging: "包装方式", packNeutral: "中性纸箱", packPrivate: "自有品牌", packRetail: "零售包装",
      customLogo: "定制标识", logoNo: "不需要", logoFrame: "需要——框架",
      logoPack: "需要——包装", logoPlanters: "需要——花箱／建筑结构",
      assembly: "组装方式", asmFlat: "平板包装（标准）", asmPre: "预组装", asmMixed: "混合",
      name: "姓名", company: "公司", email: "邮箱", phone: "电话／WhatsApp", message: "留言",
      phoneError: "请填写电话或 WhatsApp 号码，方便我们联系您。",
      nameError: "请填写您的姓名。",
      back: "← 返回", next: "继续", send: "通过 WhatsApp 发送",
      stepOf: "第 {n} 步，共 4 步",
      inquiryReceived: "询价已生成", inquiryRef: "编号 {ref}",
      inquiryDoneBody: "我们已打开 WhatsApp 并附上您的询价内容。若窗口未打开，请点击下方按钮，内容相同。",
      openWhatsApp: "打开 WhatsApp",

      chancheng: "广东佛山禅城",
      factoryTitle: "我们是家具工厂，不是贸易公司。",
      factoryBody1: "KORDIA 的生产基地位于佛山禅城区——中国户外家具产业的中心。绳编、铝管加工、铸铝、喷粉、软包车缝与成品组装均在同一厂区完成，因此定制配色可在 48 小时内报价，而非 4 周。",
      factoryBody2: "我们为欧洲、中东、北美与澳洲的进口商、酒店集团及设计单位供货。<span class=\"verify\">[待确认：出口业绩]</span>",
      slotFactoryFloor: "待补拍摄 · 工厂车间／编织线 · 4:3",
      capability: "生产能力", underOneRoof: "全流程自有",
      capabilityNote: "方括号内为占位数据——上线前请替换为 Fianna 确认的实际数字。",
      requestQuote: "索取报价",

      materialsKicker: "材质、表面处理与保养",
      materialsTitle: "用什么做的，能扛多久。",
      materialsIntro: "五大材质体系、常备表面处理颜色，以及可转交终端客户的保养说明。",
      stockFinishes: "常备框架颜色",
      ralNote: "达到起订量可定制 RAL 配色。<span class=\"verify\">[待确认起订量]</span>",
      care: "保养",

      shippingKicker: "物流、起订量与交期", shippingTitle: "从我们的车间，到您的港口。",
      shippingIntro: "订单如何报价、包装与装柜。以下每项数据都会在您正式下单前按实际订单确认。",
      shippingMoq: "物流与起订量",

      contactKicker: "联系我们", contactTitle: "从报价到装柜，一个对接人。",
      contactIntro: "出口业务由 Fianna 直接对接。发送目录页、照片或项目资料，24 小时内回复，周末亦然。",
      whatsapp: "WhatsApp", wechat: "微信", address: "地址", hours: "工作时间",
      addressValue: "中国广东省佛山市禅城区",
      hoursValue: "周一至周六 09:00–18:00（GMT+8）",
      chatOnWhatsApp: "WhatsApp 咨询",
      slotShowroom: "待补拍摄 · 展厅或工厂门口 · 4:3",
      slotMap: "地图嵌入 · 佛山禅城",

      company_: "公司", forBuyers: "采购专区", browseAll: "浏览全部产品",
      footerAddress: "中国广东省<br>佛山市禅城区",
      footerWechat: "微信 · +86 134 5084 6180",

      yourSelection: "已选产品", modelsSelected: "{n} 款",
      drawerEmpty: "您还没有选择产品。浏览时加入感兴趣的款式，可合并为一次询价发送。",
      drawerNote: "直接跳到第 4 步——您选的款式已自动附加。",
      drawerCta: "为这些款式索取报价",
      remove: "移除", sets: "套",

      catalogRequestMessage: "您好 Fianna，请发送 KORDIA 2026 产品目录给我。我的目标市场是：",
      heroChatMessage: "您好 Fianna，我对 KORDIA 户外家具很感兴趣。",
      floatingChatMessage: "您好 Fianna，我正在浏览 KORDIA 网站。",
      productMessage: "您好 Fianna，我想进一步了解",
      inquiryGreeting: "您好 Fianna，我想通过 KORDIA 网站索取报价。",
    },
  };

  const COLLECTION_META = {
    "sofa-lounge":      { cover: "KD-C003-02", ar: "ar-16-9", span: "span-8" },
    "dining":           { cover: "KD-C071-01", ar: "ar-3-4",  span: "span-4" },
    "sun-leisure":      { cover: "KD-C105-02", ar: "ar-16-9", span: "span-8" },
    "shade-structures": { cover: "KD-C118-01", ar: "ar-3-4",  span: "span-4" },
    "fire-kitchen":     { cover: "KD-C133-02", ar: "ar-3-4",  span: "span-4" },
    "garden-public":    { cover: "KD-C132-03", ar: "ar-16-9", span: "span-8" },
  };
  const TAGLINES = {
    "sofa-lounge": { en: "Rope-weave and aluminium sofa sets, modular sectionals and lounge chairs.", zh: "绳编与铝合金沙发组合、模块化沙发及休闲单椅。" },
    "dining": { en: "Four- to twelve-seat dining, bistro sets and bar counters.", zh: "四至十二人餐桌、咖啡桌椅与吧台组合。" },
    "sun-leisure": { en: "Loungers, daybeds, garden swings and hanging egg chairs.", zh: "沙滩椅、日光床、户外秋千与吊篮椅。" },
    "shade-structures": { en: "Cantilever parasols, louvred pergolas, gazebos and garden domes.", zh: "悬臂遮阳伞、电动百叶花架、凉亭与球形阳光房。" },
    "fire-kitchen": { en: "Fire tables and stainless BBQ islands to finish the terrace.", zh: "火焰桌与不锈钢烧烤中岛，完善整个户外空间。" },
    "garden-public": { en: "Park benches, picnic tables, planters and municipal seating.", zh: "公园长椅、野餐桌、花箱与市政座椅。" },
  };
  const FINISHES = [
    { key: "charcoal",   hex: "#3A3C3B", en: "Charcoal",     zh: "炭灰" },
    { key: "navy",       hex: "#16224C", en: "Kordia Navy",  zh: "藏青" },
    { key: "white",      hex: "#F7F4EB", en: "White",        zh: "白色" },
    { key: "sand",       hex: "#CBBFA4", en: "Sand",         zh: "砂色" },
    { key: "taupe",      hex: "#8A8071", en: "Taupe",        zh: "灰褐" },
    { key: "terracotta", hex: "#A8543A", en: "Terracotta",   zh: "陶土" },
  ];
  const ROPES = [
    { key: "chalk",  hex: "#E4DDCD", en: "Chalk",     zh: "米白" },
    { key: "stone",  hex: "#B9B0A0", en: "Stone",     zh: "岩灰" },
    { key: "olive",  hex: "#6E7355", en: "Olive",     zh: "橄榄绿" },
    { key: "carbon", hex: "#3B3B3D", en: "Carbon",    zh: "碳黑" },
  ];
  // Client-supplied installation photography (August 2026). `w` is the widest
  // variant that exists for each — the sources differ in size, so the srcset
  // ladder is per-image rather than uniform.
  const PROJECTS = [
    { id: "proj-resort-pool", cap: "capResortPool", type: "subHospitality", w: 1320 },
    { id: "proj-rooftop",     cap: "capRooftop",    type: "subRestaurant",  w: 1320 },
    { id: "proj-parasols",    cap: "capParasols",   type: "subHospitality", w: 1320 },
    { id: "proj-waterside",   cap: "capWaterside",  type: "subRestaurant",  w: 1280 },
    { id: "proj-lakeside",    cap: "capLakeside",   type: "subResidential", w: 1320 },
    { id: "proj-courtyard",   cap: "capCourtyard",  type: "subHospitality", w: 1170 },
  ];
  const FEATURE_PROJECT = { id: "proj-seaside-suite", cap: "capSeaside", widths: [960, 1600, 2200] };

  const CAPABILITY = [
    { v: "[__] m²",  en: "Production area",     zh: "生产面积" },
    { v: "[__]",     en: "Production lines",    zh: "生产线" },
    { v: "[__]",     en: "Staff",               zh: "员工人数" },
    { v: "500+",     en: "Models in the range", zh: "在产款型" },
    { v: "40+",      en: "Export markets",      zh: "出口市场" },
    { v: "[__]",     en: "Certifications",      zh: "认证资质" },
  ];
  const SHIPPING_FACTS = [
    { v: "[__]",   en: "MOQ per model",        zh: "单款起订量" },
    { v: "[__] d", en: "Production lead time", zh: "生产周期" },
    { v: "FOB",    en: "Standard Incoterm",    zh: "标准贸易条款" },
    { v: "[__]",   en: "Guangzhou / Shenzhen", zh: "广州／深圳" },
    { v: "100%",   en: "Pre-shipment check",   zh: "出货前验货" },
    { v: "[__]",   en: "Container CBM data",   zh: "整柜 CBM 数据" },
  ];
  const PROCESS = [
    { n: "01", en: ["Weaving", "Olefin rope hand-woven over powder-coated frames."], zh: ["编织", "丙纶绳在喷粉框架上手工编织成型。"] },
    { n: "02", en: ["Fabrication", "Aluminium tube cutting, bending and welding in-house."], zh: ["铝材加工", "铝管切割、折弯与焊接全部自有完成。"] },
    { n: "03", en: ["Casting", "Cast-aluminium components for deep-seating frames."], zh: ["铸铝", "深座框架所需铸铝件自制。"] },
    { n: "04", en: ["Powder coating", "Frame finishes matched to your RAL reference."], zh: ["喷粉", "框架颜色可按您提供的 RAL 色号匹配。"] },
    { n: "05", en: ["Cushion sewing", "Quick-dry foam and outdoor fabric, cut and sewn on site."], zh: ["软包车缝", "速干海绵与户外面料，现场裁剪车缝。"] },
    { n: "06", en: ["Assembly & packing", "Final assembly, inspection and container loading plans."], zh: ["组装与包装", "成品组装、验货与装柜方案。"] },
  ];
  const MATERIALS = [
    { img: "rope-weave", en: ["Olefin rope weave", "UV-stable solution-dyed olefin rope, hand-woven over aluminium. Holds colour in strong sun and does not absorb water.", "Rinse with fresh water and mild soap. Do not pressure-wash the weave."],
      zh: ["丙纶绳编织", "原液着色抗紫外线丙纶绳，在铝合金框架上手工编织。强光下不易褪色，且不吸水。", "用清水与中性皂液冲洗即可，切勿用高压水枪直冲编织面。"] },
    { img: "aluminium", en: ["Powder-coated aluminium", "6063 aluminium tube, cut and welded in-house, then powder-coated. Light enough to move, rigid enough for hospitality use.", "Wipe with a soft cloth. Touch up chips promptly in coastal locations."],
      zh: ["铝合金喷粉", "6063 铝管自有切焊后喷粉处理。重量轻便于搬动，强度足以应对酒店高频使用。", "用软布擦拭即可。沿海地区如有磕碰掉漆，请及时补漆。"] },
    { img: "teak", en: ["Solid teak", "Kiln-dried teak with naturally high oil content. Silvers to a soft grey outdoors unless oiled.", "Oil once or twice a year to hold the honey tone, or leave it to weather."],
      zh: ["实心柚木", "窑干柚木，天然油脂含量高。户外使用若不上油，会自然转为柔和银灰色。", "每年上油一至两次可保持蜜色，或任其自然风化。"] },
    { img: "rope-weave", en: ["Textilene & outdoor fabric", "Mesh and solution-dyed fabrics for slings and cushions, chosen for drainage and fade resistance.", "Machine-washable covers on most models. Air-dry, do not tumble."],
      zh: ["特斯林与户外面料", "网布与原液着色面料用于绷带椅与坐垫，兼顾排水与抗褪色。", "多数款式坐垫套可机洗。请自然晾干，勿烘干。"] },
    { img: "aluminium", en: ["HPL, ceramic & sintered stone", "Table tops that survive heat, wine and sunscreen without staining.", "Everyday cleaning with soap and water; no abrasive pads."],
      zh: ["HPL、陶瓷与岩板", "桌面耐高温、耐红酒与防晒霜污渍，不易留痕。", "日常用皂液清水清洁即可，请勿使用百洁布。"] },
  ];

  /* ------------------------------------------------------------------ state */
  const state = {
    lang: localStorage.getItem("kordia-lang") === "zh" ? "zh" : "en",
    screen: "home",
    collection: "all",
    subcategory: "all",
    query: "",
    sort: "catalog",
    limit: PAGE_SIZE,
    productId: null,
    selection: new Map(readSelection()),
    finish: "charcoal",
    rope: "chalk",
    wizardStep: 1,
    wizardCollections: new Set(),
    heroIndex: 0,
  };

  function readSelection() {
    try {
      const raw = JSON.parse(localStorage.getItem("kordia-selection") || "[]");
      return Array.isArray(raw) ? raw.filter((e) => e && typeof e.id === "string").map((e) => [e.id, e.qty || 20]) : [];
    } catch { return []; }
  }
  function saveSelection() {
    localStorage.setItem("kordia-selection",
      JSON.stringify([...state.selection].map(([id, qty]) => ({ id, qty }))));
  }

  const t = (k) => (T[state.lang][k] ?? T.en[k] ?? k);
  // English needs a singular form; Chinese has no plural inflection, so the
  // `_one` variants simply do not exist there and it falls back to the base key.
  const fmt = (k, vars) => {
    const key = (vars && vars.n === 1 && T[state.lang][`${k}_one`]) ? `${k}_one` : k;
    return Object.entries(vars || {}).reduce((s, [a, b]) => s.replaceAll(`{${a}}`, b), t(key));
  };
  const esc = (v) => String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  const $ = (s) => document.querySelector(s);
  const byId = (id) => document.getElementById(id);
  const wa = (msg) => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  const productById = (id) => catalog.products.find((p) => p.id === id);
  const collectionBySlug = (s) => catalog.collections.find((c) => c.slug === s);
  const subBySlug = (s) => catalog.subcategories.find((x) => x.slug === s);
  const label = (o) => (o ? o.name[state.lang] : "");

  // Grid slots are ~1/3 of a 1440 shell on desktop, halving down the breakpoints.
  const GRID_SIZES = "(min-width: 1181px) calc((min(1440px, 100vw - 64px) - 288px - 56px - 48px) / 3), " +
    "(min-width: 981px) calc((min(1440px, 100vw - 64px) - 24px) / 2), " +
    "(min-width: 621px) calc((100vw - 72px) / 2), calc((100vw - 54px) / 2)";
  const srcset = (p) => p.variants.map((v) => `${v.src} ${v.w}w`).join(", ");
  const atLeast = (p, w) => p.variants.find((v) => v.w >= w) || p.variants[p.variants.length - 1];

  /* ------------------------------------------------------------- translation */
  function applyStatic() {
    document.documentElement.lang = state.lang === "zh" ? "zh-CN" : "en";
    document.title = state.lang === "zh"
      ? "KORDIA 户外家具制造商 | 中国佛山"
      : "KORDIA Outdoor Furniture Manufacturer | Foshan, China";
    document.querySelectorAll("[data-i18n]").forEach((n) => { n.textContent = t(n.dataset.i18n); });
    document.querySelectorAll("[data-i18n-html]").forEach((n) => { n.innerHTML = t(n.dataset.i18nHtml); });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((n) => { n.placeholder = t(n.dataset.i18nPlaceholder); });
    document.querySelectorAll("[data-i18n-label]").forEach((n) => { n.setAttribute("aria-label", t(n.dataset.i18nLabel)); });
    document.querySelectorAll("[data-i18n-alt]").forEach((n) => { n.alt = t(n.dataset.i18nAlt); });
    document.querySelectorAll("[data-lang-label]").forEach((n) => {
      n.classList.toggle("is-active", n.dataset.langLabel === state.lang);
    });
    // Prefilled WhatsApp text follows the language; otherwise a Chinese visitor
    // opens a chat written in the language they just switched away from.
    document.querySelectorAll("[data-wa]").forEach((n) => { n.href = wa(t(n.dataset.wa)); });
  }

  /* ------------------------------------------------------------------ header */
  function renderMega() {
    byId("mega-cols").innerHTML = catalog.collections.map((c) => `
      <div class="mega-col">
        <button type="button" data-open-collection="${c.slug}">${esc(label(c))}</button>
        <div class="mega-count">${c.photoCount} ${esc(t("photosShort"))}</div>
        <div class="mega-subs">
          ${catalog.subcategories.filter((s) => s.collection === c.slug).map((s) => `
            <button class="text-link" type="button" data-open-sub="${s.slug}">${esc(label(s))}</button>
          `).join("")}
        </div>
      </div>`).join("");
    const feat = productById(COLLECTION_META["sofa-lounge"].cover) || catalog.products[0];
    const v = atLeast(feat, 400);
    const img = byId("mega-feature-img");
    img.src = v.src; img.srcset = srcset(feat);
    // This is a portrait crop of a landscape catalog image. Advertise the
    // source width needed after object-fit: cover, not just the CSS box width.
    img.sizes = "660px";
    img.width = v.w; img.height = v.h;
    byId("mega-feature-label").textContent =
      `${label(collectionBySlug("sofa-lounge"))} — ${collectionBySlug("sofa-lounge").photoCount} ${t("photosShort")}`;
  }

  function closeMega() {
    byId("mega").hidden = true;
    byId("mega-toggle").setAttribute("aria-expanded", "false");
  }

  /* -------------------------------------------------------------------- home */
  function renderHome() {
    byId("stat-categories").textContent = String(catalog.subcategories.length);
    byId("home-collections").innerHTML = catalog.collections.map((c, i) => {
      const meta = COLLECTION_META[c.slug];
      const cover = productById(meta.cover) || catalog.products.find((p) => p.collection === c.slug);
      const v = atLeast(cover, 800);
      const wide = meta.span === "span-12";
      const coverSizes = meta.span === "span-12"
        ? "calc(min(1440px, 100vw - 64px))"
        : meta.span === "span-8"
          ? "(min-width: 981px) 950px, (min-width: 621px) 50vw, 100vw"
          : "(min-width: 981px) 950px, (min-width: 621px) 100vw, 200vw";
      return `
        <button class="coll-card reveal d${(i % 4) + 1} ${meta.span}" type="button" data-open-collection="${c.slug}">
          <span class="frame ${meta.ar}" style="display:block">
            <img src="${v.src}" srcset="${srcset(cover)}"
                 sizes="${coverSizes}"
                 width="${v.w}" height="${v.h}" loading="lazy" decoding="async" alt="${esc(label(c))}">
          </span>
          ${wide ? `
          <span class="coll-card-wide-foot">
            <span>
              <h3>${esc(label(c))}</h3>
              <p>${esc(TAGLINES[c.slug][state.lang])}</p>
            </span>
            <span class="count" style="padding-bottom:4px">${c.photoCount} ${esc(t("photosShort"))}</span>
          </span>` : `
          <h3>${esc(label(c))}</h3>
          <p>${esc(TAGLINES[c.slug][state.lang])}</p>
          <span class="count">${c.photoCount} ${esc(t("photosShort"))}</span>`}
        </button>`;
    }).join("");

    const band = productById("KD-C061-01") || catalog.products[40];
    const bv = atLeast(band, 800);
    const bandImg = byId("catalog-band-img");
    bandImg.src = bv.src; bandImg.srcset = srcset(band); bandImg.width = bv.w; bandImg.height = bv.h;
    bandImg.sizes = "(min-width: 981px) 800px, 100vw";
    bandImg.alt = "";
  }

  /* ------------------------------------------------------------- collections */
  function renderCollectionsIndex() {
    byId("collections-kicker").textContent =
      `${catalog.subcategories.length} ${t("category")} · ${catalog.total} ${t("photos")}`;
    byId("collections-list").innerHTML = catalog.collections.map((c) => {
      const cover = productById(COLLECTION_META[c.slug].cover) || catalog.products.find((p) => p.collection === c.slug);
      const v = atLeast(cover, 800);
      return `
        <div class="coll-row">
          <img src="${v.src}" srcset="${srcset(cover)}"
               sizes="(min-width: 981px) 700px, calc(100vw - 48px)"
               width="${v.w}" height="${v.h}" loading="lazy" decoding="async" alt="${esc(label(c))}">
          <div>
            <h2>${esc(label(c))}</h2>
            <p>${esc(TAGLINES[c.slug][state.lang])}</p>
            <div class="chip-row" style="margin-bottom:28px">
              ${catalog.subcategories.filter((s) => s.collection === c.slug).map((s) => `
                <button class="chip" type="button" data-open-sub="${s.slug}">${esc(label(s))}</button>`).join("")}
            </div>
            <div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap">
              <button class="btn btn-outline" type="button" data-open-collection="${c.slug}">${esc(t("enterCollection"))}</button>
              <span class="eyebrow">${c.photoCount} ${esc(t("photosShort"))}</span>
            </div>
          </div>
        </div>`;
    }).join("");
  }

  /* ------------------------------------------------------------------ browse */
  function filtered() {
    const q = state.query.trim().toLowerCase();
    let list = catalog.products.filter((p) => {
      if (state.collection !== "all" && p.collection !== state.collection) return false;
      if (state.subcategory !== "all" && p.subcategory !== state.subcategory) return false;
      if (!q) return true;
      return [p.id, p.ref, p.catalogPage, p.name.en, p.name.zh, p.collectionName.en, p.collectionName.zh,
        p.subcategoryName.en, p.subcategoryName.zh].join(" ").toLowerCase().includes(q);
    });
    if (state.sort === "reverse") list = [...list].reverse();
    else if (state.sort === "category") {
      list = [...list].sort((a, b) => a.subcategory.localeCompare(b.subcategory) || a.position - b.position);
    }
    return list;
  }

  function productCard(p) {
    const sel = state.selection.has(p.id);
    const v = atLeast(p, 400);
    return `
      <article class="p-card">
        <button type="button" data-open-product="${p.id}">
          <span class="frame" style="display:block">
            <img src="${v.src}" srcset="${srcset(p)}" sizes="${GRID_SIZES}"
                 width="${v.w}" height="${v.h}" loading="lazy" decoding="async" alt="${esc(p.name[state.lang])}">
          </span>
          <span class="name" style="display:block">${esc(p.name[state.lang])}</span>
          <span class="meta tabular" style="display:block">${esc(p.id)} · ${esc(p.subcategoryName[state.lang])}</span>
        </button>
        <div class="foot">
          <span>${esc(t("customQuote"))}</span>
          <button class="add-btn ${sel ? "is-selected" : ""}" type="button"
                  data-add="${p.id}" aria-pressed="${sel}">${esc(sel ? t("added") : t("add"))}</button>
        </div>
      </article>`;
  }

  function renderBrowse() {
    const coll = state.collection === "all" ? null : collectionBySlug(state.collection);
    const sub = state.subcategory === "all" ? null : subBySlug(state.subcategory);
    const title = sub ? label(sub) : (coll ? label(coll) : t("browseAll"));
    byId("browse-crumb").textContent = title;
    byId("browse-title").textContent = title;
    byId("browse-intro").textContent = coll ? TAGLINES[coll.slug][state.lang] : t("collectionsIntro");

    const all = filtered();
    byId("browse-total").textContent = String(sub ? sub.photoCount : (coll ? coll.photoCount : catalog.total));
    byId("browse-total-label").textContent = t("photosShort");

    // sub chips for the active collection
    const chips = coll ? catalog.subcategories.filter((s) => s.collection === coll.slug) : [];
    byId("browse-chips").innerHTML = coll ? [
      `<button class="chip ${state.subcategory === "all" ? "is-active" : ""}" type="button" data-sub="all">${esc(t("allCategories"))}</button>`,
      ...chips.map((s) => `<button class="chip ${state.subcategory === s.slug ? "is-active" : ""}" type="button" data-sub="${s.slug}">${esc(label(s))} (${s.photoCount})</button>`),
    ].join("") : "";
    byId("browse-chips").hidden = !coll;

    byId("facet-collections").innerHTML = [
      `<button type="button" data-coll="all" class="${state.collection === "all" ? "is-active" : ""}">${esc(t("allCollections"))}</button>`,
      ...catalog.collections.map((c) => `<button type="button" data-coll="${c.slug}" class="${state.collection === c.slug ? "is-active" : ""}">${esc(label(c))} (${c.photoCount})</button>`),
    ].join("");
    const subs = coll ? chips : catalog.subcategories;
    byId("facet-subcategories").innerHTML = [
      `<button type="button" data-sub="all" class="${state.subcategory === "all" ? "is-active" : ""}">${esc(t("allCategories"))}</button>`,
      ...subs.map((s) => `<button type="button" data-sub="${s.slug}" class="${state.subcategory === s.slug ? "is-active" : ""}">${esc(label(s))} (${s.photoCount})</button>`),
    ].join("");

    const shown = all.slice(0, state.limit);
    byId("browse-showing").textContent = fmt("showing", { shown: shown.length, total: all.length });
    byId("browse-grid").innerHTML = shown.map(productCard).join("");
    byId("browse-grid").hidden = all.length === 0;
    byId("browse-empty").hidden = all.length !== 0;

    const remaining = all.length - shown.length;
    byId("load-more-row").hidden = remaining <= 0;
    byId("load-more").textContent = fmt("loadMore", { n: Math.min(PAGE_SIZE, remaining) });

    const search = byId("browse-search");
    if (search.value !== state.query) search.value = state.query;
    byId("browse-sort").value = state.sort;
  }

  /* ------------------------------------------------------------- product page */
  function renderProduct() {
    const p = productById(state.productId);
    if (!p) return;
    const big = p.variants[p.variants.length - 1];
    const img = byId("pd-image");
    img.src = big.src; img.srcset = srcset(p);
    img.sizes = "(min-width: 1181px) calc((min(1440px, 100vw - 64px) - 64px) * 7 / 12), " +
      "(min-width: 621px) calc(100vw - 48px), 125vw";
    img.width = big.w; img.height = big.h; img.alt = p.name[state.lang];

    byId("pd-crumb-collection").textContent = p.collectionName[state.lang];
    byId("pd-crumb-collection").dataset.openCollection = p.collection;
    byId("pd-crumb-ref").textContent = p.id;
    byId("pd-subcategory").textContent = p.subcategoryName[state.lang];
    byId("pd-title").textContent = p.name[state.lang];
    byId("pd-ref").textContent = `${t("specCatalogRef")} ${p.id}`;

    byId("pd-glance").innerHTML = [
      [t("specModel"), p.model || "—"],
      [t("specCollection"), p.collectionName[state.lang]],
      [t("specCategory"), p.subcategoryName[state.lang]],
      [t("specCatalogPage"), String(p.catalogPage)],
    ].map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");

    // Per-piece dimensions from the factory quote book. Products the book
    // leaves blank say so — we never publish an inferred measurement.
    const dimEl = byId("pd-dimensions");
    if (dimEl) {
      if (p.dimensions && p.dimensions.length) {
        dimEl.innerHTML = p.dimensions.map((d) =>
          `<li><span class="dim-label">${esc(d.label || "—")}</span>` +
          `<span class="dim-value tabular">${esc(d.cm)}</span></li>`).join("");
      } else {
        dimEl.innerHTML = `<li class="dim-pending">${esc(t("specDimsPending"))}</li>`;
      }
    }

    // Sibling photographs from the same catalog page act as alternate views.
    const siblings = catalog.products.filter((x) => x.catalogPage === p.catalogPage);
    const thumbs = (siblings.length > 1 ? siblings : catalog.products.filter((x) => x.subcategory === p.subcategory)).slice(0, 4);
    byId("pd-thumbs").innerHTML = thumbs.map((x) => {
      const v = atLeast(x, 400);
      return `<button type="button" class="${x.id === p.id ? "is-active" : ""}" data-open-product="${x.id}">
        <img src="${v.src}" width="${v.w}" height="${v.h}" loading="lazy" decoding="async" alt="${esc(x.name[state.lang])}">
      </button>`;
    }).join("");

    byId("pd-finishes").innerHTML = FINISHES.map((f) => `
      <button class="swatch ${state.finish === f.key ? "is-active" : ""}" type="button"
              data-finish="${f.key}" title="${esc(f[state.lang])}" aria-label="${esc(f[state.lang])}"
              style="background:${f.hex}"></button>`).join("");
    byId("pd-ropes").innerHTML = ROPES.map((r) => `
      <button class="swatch ${state.rope === r.key ? "is-active" : ""}" type="button"
              data-rope="${r.key}" title="${esc(r[state.lang])}" aria-label="${esc(r[state.lang])}"
              style="background:${r.hex}"></button>`).join("");
    byId("pd-finish-label").textContent = FINISHES.find((f) => f.key === state.finish)[state.lang];
    byId("pd-rope-label").textContent = ROPES.find((r) => r.key === state.rope)[state.lang];

    const sel = state.selection.has(p.id);
    const add = byId("pd-add");
    add.textContent = sel ? t("inSelection") : t("addToSelection");
    add.setAttribute("aria-pressed", String(sel));
    byId("pd-whatsapp").href = wa(`${t("productMessage")} ${p.id} — ${p.name[state.lang]}.`);

    byId("pd-specs").innerHTML = [
      [t("specCatalogRef"), p.id],
      [t("specModel"), p.model || "—"],
      [t("specDimensions"), p.dimensions && p.dimensions.length
        ? p.dimensions.map((d) => (d.label ? d.label + " " : "") + d.cm).join("  ·  ")
        : t("specDimsPending")],
      [t("specCollection"), p.collectionName[state.lang]],
      [t("specCategory"), p.subcategoryName[state.lang]],
      [t("specCatalogPage"), String(p.catalogPage)],
      [t("frameFinish"), FINISHES.find((f) => f.key === state.finish)[state.lang]],
      [t("ropeColour"), ROPES.find((r) => r.key === state.rope)[state.lang]],
      [t("specLead"), t("specLeadValue")],
      [t("specMoq"), t("specMoqValue")],
    ].map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td class="tabular">${esc(v)}</td></tr>`).join("");

    const relBtn = byId("pd-all-in-category");
    relBtn.textContent = fmt("allInCategory", { name: p.subcategoryName[state.lang] });
    relBtn.dataset.openSub = p.subcategory;

    const related = catalog.products.filter((x) => x.subcategory === p.subcategory && x.id !== p.id).slice(0, 4);
    byId("pd-related").innerHTML = related.map((x) => {
      const v = atLeast(x, 400);
      return `<button type="button" data-open-product="${x.id}" style="background:none;border:0;padding:0;cursor:pointer;text-align:left">
        <span class="frame ar-4-3" style="display:block;overflow:hidden;background:var(--sand)">
          <img src="${v.src}" srcset="${srcset(x)}" sizes="${GRID_SIZES}" width="${v.w}" height="${v.h}"
               loading="lazy" decoding="async" alt="${esc(x.name[state.lang])}"
               style="width:100%;height:100%;object-fit:cover">
        </span>
        <span style="display:block;font-size:15px;font-weight:500;color:var(--ink);margin-top:14px">${esc(x.name[state.lang])}</span>
        <span class="tabular" style="display:block;font-size:13px;color:var(--muted);margin-top:4px">${esc(x.id)}</span>
      </button>`;
    }).join("");
  }

  /* ---------------------------------------------------------------- projects */
  const PROJECT_SIZES = "(min-width: 981px) calc((min(1440px, 100vw - 64px) - 48px) / 3), " +
    "(min-width: 621px) calc((100vw - 72px) / 2), calc((100vw - 54px) / 2)";

  function projectSrcset(p) {
    return [440, 880, p.w].filter((w, i, a) => a.indexOf(w) === i && w <= p.w)
      .map((w) => `assets/images/projects/${p.id}-${w}.webp ${w}w`).join(", ");
  }

  function projectCard(p) {
    return `
      <article class="project-card reveal">
        <button type="button" data-lightbox="${p.id}" data-cap="${p.cap}" data-w="${p.w}"
                aria-label="${esc(t(p.cap))}">
          <img src="assets/images/projects/${p.id}-440.webp" srcset="${projectSrcset(p)}"
               sizes="${PROJECT_SIZES}" width="440" height="330"
               loading="lazy" decoding="async" alt="${esc(t(p.cap))}">
        </button>
        <div class="cap">${esc(t(p.cap))}</div>
        <div class="sub">${esc(t(p.type))}</div>
      </article>`;
  }

  function renderProjects() {
    const grid = byId("projects-grid");
    if (grid) grid.innerHTML = PROJECTS.map(projectCard).join("");
    // V4 reserved a "Where it ships" section with id="home-projects"; the grid
    // inside it is home-projects-grid so the two ids do not collide.
    const home = byId("home-projects-grid");
    if (home) home.innerHTML = PROJECTS.slice(0, 3).map(projectCard).join("");
  }

  /* ------------------------------------------------------------------ static */
  function renderStaticScreens() {
    byId("capability-grid").innerHTML = CAPABILITY.map((c) =>
      `<div><b>${esc(c.v)}</b><span>${esc(c[state.lang])}</span></div>`).join("");
    byId("shipping-grid").innerHTML = SHIPPING_FACTS.map((c) =>
      `<div><b>${esc(c.v)}</b><span>${esc(c[state.lang])}</span></div>`).join("");
    // Rendered as a numbered list rather than six image slots: only three
    // factory photographs exist, and five striped placeholders next to one real
    // photo reads as unfinished rather than as an honest gap.
    byId("process-grid").innerHTML = PROCESS.map((s) => {
      const [title, body] = s[state.lang];
      return `<div class="reveal">
        <div style="height:1px;background:var(--line);margin-bottom:16px"></div>
        <div class="eyebrow" style="margin-bottom:8px">${s.n}</div>
        <h3 style="font-family:var(--sans);font-size:1.25rem;font-weight:600;margin:0 0 8px">${esc(title)}</h3>
        <p style="margin:0;font-size:15px">${esc(body)}</p>
      </div>`;
    }).join("");
    byId("shipping-steps").innerHTML = PROCESS.slice(3).map((s) => {
      const [title, body] = s[state.lang];
      return `<div><div class="eyebrow" style="margin-bottom:8px">${s.n}</div>
        <h3 style="font-family:var(--sans);font-size:1.25rem;font-weight:600;margin:0 0 8px">${esc(title)}</h3>
        <p style="margin:0;font-size:15px">${esc(body)}</p></div>`;
    }).join("");

    byId("materials-list").innerHTML = MATERIALS.map((m) => {
      const [name, body, care] = m[state.lang];
      return `<div class="mat-row">
        <img src="assets/images/material/${m.img}-440.webp"
             srcset="assets/images/material/${m.img}-440.webp 440w, assets/images/material/${m.img}-880.webp 880w"
             sizes="(min-width: 981px) calc((min(1440px, 100vw - 64px)) / 3), calc(100vw - 48px)"
             width="440" height="587" loading="lazy" decoding="async" alt="${esc(name)}">
        <div>
          <h2>${esc(name)}</h2>
          <p style="margin:0 0 24px;max-width:64ch">${esc(body)}</p>
          <div class="facet-label">${esc(t("care"))}</div>
          <p style="margin:0;font-size:15px;color:var(--muted);max-width:60ch">${esc(care)}</p>
        </div>
      </div>`;
    }).join("");

    byId("finish-strip").innerHTML = FINISHES.map((f) =>
      `<div><div class="sw" style="background:${f.hex}"></div><span>${esc(f[state.lang])}</span></div>`).join("");

    byId("footer-collections").innerHTML = catalog.collections.map((c) =>
      `<button type="button" data-open-collection="${c.slug}">${esc(label(c))}</button>`).join("");
  }

  /* ------------------------------------------------------------------ drawer */
  function renderDrawer() {
    const items = [...state.selection].map(([id, qty]) => ({ p: productById(id), qty })).filter((x) => x.p);
    byId("sel-count").textContent = String(items.length);
    byId("drawer-title").textContent = fmt("modelsSelected", { n: items.length });
    byId("drawer-body").innerHTML = items.length ? items.map(({ p, qty }) => {
      const v = atLeast(p, 400);
      return `<div class="drawer-item">
        <img src="${v.src}" width="84" height="63" loading="lazy" alt="">
        <div style="flex:1">
          <div class="name">${esc(p.name[state.lang])}</div>
          <div class="ref tabular">${esc(p.id)} · ${esc(p.subcategoryName[state.lang])}</div>
          <div class="row">
            <input class="tabular" type="number" min="1" value="${qty}" data-qty="${p.id}" aria-label="${esc(t("sets"))}">
            <span style="font-size:12px;color:var(--muted)">${esc(t("sets"))}</span>
            <button class="drawer-remove" type="button" data-remove="${p.id}">${esc(t("remove"))}</button>
          </div>
        </div>
      </div>`;
    }).join("") : `<p style="margin:40px 0;color:var(--muted);font-size:15px">${esc(t("drawerEmpty"))}</p>`;
    byId("drawer-quote").textContent = t("drawerCta");
    byId("drawer-quote").disabled = items.length === 0;
    byId("drawer-quote").style.opacity = items.length === 0 ? ".5" : "1";
  }

  function syncAddButtons(id) {
    const sel = state.selection.has(id);
    document.querySelectorAll(`[data-add="${CSS.escape(id)}"]`).forEach((b) => {
      b.classList.toggle("is-selected", sel);
      b.setAttribute("aria-pressed", String(sel));
      b.textContent = sel ? t("added") : t("add");
    });
    if (state.screen === "product" && state.productId === id) {
      const add = byId("pd-add");
      add.textContent = sel ? t("inSelection") : t("addToSelection");
      add.setAttribute("aria-pressed", String(sel));
    }
  }

  function toggleSelection(id) {
    if (state.selection.has(id)) state.selection.delete(id);
    else state.selection.set(id, 20);
    saveSelection();
    syncAddButtons(id);
    renderDrawer();
    renderWizardAttachments();
  }

  /* ------------------------------------------------------------------ wizard */
  function renderWizardSteps() {
    const labels = [t("stepCategory"), t("stepRequirements"), t("stepSpec"), t("stepContact")];
    byId("wizard-steps").innerHTML = labels.map((l, i) => {
      const n = i + 1;
      const cls = n === state.wizardStep ? "is-current" : (n < state.wizardStep ? "is-done" : "");
      return `<button type="button" class="${cls}" data-step-to="${n}">
        <span class="bar" style="display:block"></span>
        <span class="label" style="display:block">${n} · ${esc(l)}</span>
      </button>`;
    }).join("");
    document.querySelectorAll(".wizard-step").forEach((el) => {
      el.hidden = Number(el.dataset.step) !== state.wizardStep;
    });
    byId("wizard-progress").textContent = fmt("stepOf", { n: state.wizardStep });
    byId("wizard-next").textContent = state.wizardStep === 4 ? t("send") : t("next");
    byId("wizard-prev").style.visibility = state.wizardStep === 1 ? "hidden" : "visible";
  }

  function renderWizardAttachments() {
    const wc = byId("wizard-collections");
    if (wc) {
      wc.innerHTML = catalog.collections.map((c) => `
        <button class="chip ${state.wizardCollections.has(c.slug) ? "is-active" : ""}" type="button"
                data-wizard-coll="${c.slug}" aria-pressed="${state.wizardCollections.has(c.slug)}">${esc(label(c))}</button>`).join("");
    }
    const n = state.selection.size;
    const text = n ? fmt("attachedCount", { n }) + " — " + [...state.selection.keys()].join(", ") : t("noneAttached");
    const a = byId("wizard-attached");
    if (a) a.textContent = text;
    const s = byId("wizard-summary");
    if (s) s.textContent = text;
    const wf = byId("wizard-finishes");
    if (wf) {
      wf.innerHTML = FINISHES.map((f) => `
        <button class="swatch ${state.finish === f.key ? "is-active" : ""}" type="button"
                data-finish="${f.key}" title="${esc(f[state.lang])}" aria-label="${esc(f[state.lang])}"
                style="background:${f.hex}"></button>`).join("");
      byId("wizard-finish-label").textContent = FINISHES.find((f) => f.key === state.finish)[state.lang];
    }
  }

  function wizardMessage() {
    const f = byId("wizard-form");
    const g = (n) => (f.elements[n] ? String(f.elements[n].value || "").trim() : "");
    const lines = [t("inquiryGreeting"), ""];
    const cols = [...state.wizardCollections].map((s) => label(collectionBySlug(s))).join(", ");
    if (cols) lines.push(`${t("whatSourcing")} ${cols}`);
    const pairs = [
      [t("qty"), g("qty")], [t("market"), g("market")], [t("useCase"), g("useCase")],
      [t("delivery"), g("delivery")], [t("port"), g("port")], [t("incoterm"), g("incoterm")],
      [t("frameFinish"), FINISHES.find((x) => x.key === state.finish)[state.lang]],
      [t("ropeFabric"), g("rope")], [t("packaging"), g("packaging")],
      [t("customLogo"), g("logo")], [t("assembly"), g("assembly")],
      [t("name"), g("name")], [t("company"), g("company")], [t("email"), g("email")], [t("phone"), g("phone")],
      [t("message"), g("message")],
    ];
    pairs.forEach(([k, v]) => { if (v) lines.push(`${k}: ${v}`); });
    if (state.selection.size) {
      lines.push("", `${t("attachedModels")}:`);
      [...state.selection].forEach(([id, qty]) => {
        const p = productById(id);
        if (p) lines.push(`• ${id} — ${p.name[state.lang]} × ${qty} ${t("sets")}`);
      });
    }
    return lines.join("\n");
  }

  /* ------------------------------------------------------------------ router */
  const SCREENS = ["home", "signature", "settings", "collections", "collection", "product", "projects", "inquiry", "factory", "materials", "shipping", "contact"];

  function parseHash() {
    const h = location.hash.replace(/^#\/?/, "");
    if (!h) return { screen: "home" };
    const [a, b] = h.split("/");
    if (a === "c") return { screen: "collection", collection: b || "all" };
    if (a === "s") return { screen: "collection", subcategory: b || "all" };
    if (a === "p") return { screen: "product", productId: b };
    // A setting is a saved view over the same catalogue, not a separate data
    // set — it resolves to the collections that feed it.
    if (a === "set") return { screen: "collection", setting: b || "all" };
    return { screen: SCREENS.includes(a) ? a : "home" };
  }

  function route(push) {
    const r = parseHash();
    state.screen = r.screen;
    if (r.screen === "collection") {
      // Unknown slugs fall back to "all" rather than rendering an empty grid
      // that looks broken.
      if (r.collection !== undefined) {
        state.collection = collectionBySlug(r.collection) ? r.collection : "all";
        state.subcategory = "all";
      }
      if (r.subcategory !== undefined) {
        const sub = subBySlug(r.subcategory);
        state.subcategory = sub ? r.subcategory : "all";
        state.collection = sub ? sub.collection : "all";
      }
      state.limit = PAGE_SIZE;
    }
    // An unknown id used to leave the previous product's content on screen while
    // the URL said something else, so a mistyped or stale link showed the wrong
    // model. Send those to the collections index instead.
    if (r.screen === "product") {
      if (r.productId && productById(r.productId)) {
        state.productId = r.productId;
      } else {
        location.replace("#/collections");
        return;
      }
    }

    SCREENS.forEach((s) => { const el = byId(`screen-${s}`); if (el) el.hidden = s !== state.screen; });
    document.querySelectorAll(".main-nav [data-go]").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.go === state.screen);
    });
    closeMega();
    byId("mobile-nav").classList.remove("is-open");
    byId("menu-toggle").setAttribute("aria-expanded", "false");

    if (state.screen === "collection") renderBrowse();
    if (state.screen === "product") renderProduct();
    if (state.screen === "inquiry") { renderWizardSteps(); renderWizardAttachments(); }
    if (state.screen === "signature") renderSignature();
    if (state.screen === "settings") renderSettings("settings-list");
    observeReveals();
    if (push !== false) window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }

  /* --------------------------------------------------- signature + settings */
  // The eleven Signature renders are page-keyed, not product-keyed — they came
  // from a separate PDF and have no SKU behind them yet.
  function renderSignature() {
    const el = byId("sig-grid");
    if (!el || el.dataset.filled) return;
    const sig = catalog.signature;
    if (!sig) return;
    el.innerHTML = sig.renders.map((pg, i) => `
      <figure class="sig-item${i % 3 === 0 ? " sig-item-wide" : ""}">
        <img src="assets/images/signature/kordia-${pg}-880.webp"
             srcset="assets/images/signature/kordia-${pg}-440.webp 440w, assets/images/signature/kordia-${pg}-880.webp 880w, assets/images/signature/kordia-${pg}-1600.webp 1600w"
             sizes="(min-width: 981px) 46vw, 100vw"
             loading="lazy" decoding="async" alt="KORDIA Signature ${esc(pg)}">
      </figure>`).join("");
    el.dataset.filled = "1";
  }

  function renderSettings(targetId) {
    const el = byId(targetId);
    if (!el || el.dataset.filled) return;
    const sets = catalog.settings || [];
    el.innerHTML = sets.map((s) => {
      const n = catalog.products.filter((p) => p.setting === s.slug).length;
      // Lead image: first product of the feeding collection, so the tile is
      // never empty and always shows real stock.
      const lead = catalog.products.find((p) => p.setting === s.slug);
      const v = lead ? atLeast(lead, 800) : null;
      return `<button class="set-card reveal" type="button" data-open-setting="${s.slug}">
        ${v ? `<img src="${v.src}" width="${v.w}" height="${v.h}" loading="lazy" decoding="async" alt="">` : ""}
        <span class="set-card-body">
          <span class="set-card-name">${esc(s.name[state.lang])}</span>
          <span class="set-card-count">${esc(fmt("setCount", { n: n }))}</span>
        </span>
      </button>`;
    }).join("");
    el.dataset.filled = "1";
  }

  function go(hash) {
    if (location.hash === hash) route();
    else location.hash = hash;
  }

  /* ------------------------------------------------------------------- hero */
  const slides = [...document.querySelectorAll(".hero-slide")];
  const pagers = [...document.querySelectorAll("[data-hero]")];
  function hydrate(slide) {
    if (!slide || !slide.dataset.src) return;
    slide.sizes = slide.dataset.sizes || "100vw";
    slide.srcset = slide.dataset.srcset || "";
    slide.src = slide.dataset.src;
    delete slide.dataset.src; delete slide.dataset.srcset; delete slide.dataset.sizes;
  }
  function setHero(i) {
    state.heroIndex = (i + slides.length) % slides.length;
    hydrate(slides[state.heroIndex]);
    hydrate(slides[(state.heroIndex + 1) % slides.length]);
    slides.forEach((s, n) => s.classList.toggle("is-active", n === state.heroIndex));
    pagers.forEach((b, n) => {
      b.classList.toggle("is-active", n === state.heroIndex);
      b.setAttribute("aria-pressed", String(n === state.heroIndex));
    });
  }

  /* ----------------------------------------------------------------- reveals */
  let revealObserver = null;
  function observeReveals() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach((e) => e.classList.add("in"));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); revealObserver.unobserve(e.target); } });
      }, { rootMargin: "0px 0px -8% 0px" });
    }
    document.querySelectorAll(".reveal:not(.in)").forEach((e) => revealObserver.observe(e));
  }

  /* ------------------------------------------------------------------- wires */
  function renderAll() {
    applyStatic();
    renderMega();
    renderHome();
    renderCollectionsIndex();
    renderProjects();
    renderStaticScreens();
    renderDrawer();
    // Language switch re-renders everything, so clear the fill guards first.
    ["sig-grid", "settings-list", "home-settings"].forEach((id) => {
      const n = byId(id); if (n) delete n.dataset.filled;
    });
    renderSignature();
    renderSettings("settings-list");
    renderSettings("home-settings");
    if (state.screen === "collection") renderBrowse();
    if (state.screen === "product") renderProduct();
    if (state.screen === "inquiry") { renderWizardSteps(); renderWizardAttachments(); }
    observeReveals();
  }

  function setLang(lang) {
    state.lang = lang;
    localStorage.setItem("kordia-lang", lang);
    renderAll();
  }

  document.addEventListener("click", (ev) => {
    const el = ev.target.closest("[data-go],[data-open-collection],[data-open-sub],[data-open-product],[data-open-setting],[data-add],[data-sub],[data-coll],[data-finish],[data-rope],[data-remove],[data-hero],[data-step-to],[data-wizard-coll],[data-lightbox]");
    if (!el) return;

    if (el.dataset.lightbox) {
      lightboxOpener = el;
      openLightbox(el.dataset.lightbox, el.dataset.cap, el.dataset.w || 2200);
      return;
    }

    if (el.dataset.go) { go(el.dataset.go === "home" ? "#/home" : `#/${el.dataset.go}`); return; }
    if (el.dataset.openSetting) { go(`#/set/${el.dataset.openSetting}`); return; }
    if (el.dataset.openCollection) { go(`#/c/${el.dataset.openCollection}`); return; }
    if (el.dataset.openSub) { go(`#/s/${el.dataset.openSub}`); return; }
    if (el.dataset.openProduct) { go(`#/p/${el.dataset.openProduct}`); return; }
    if (el.dataset.add) { toggleSelection(el.dataset.add); return; }
    if (el.dataset.remove) { toggleSelection(el.dataset.remove); return; }
    if (el.dataset.hero !== undefined) { setHero(Number(el.dataset.hero)); return; }

    if (el.dataset.coll) {
      state.collection = el.dataset.coll; state.subcategory = "all"; state.limit = PAGE_SIZE;
      renderBrowse(); return;
    }
    if (el.dataset.sub) {
      if (el.dataset.sub === "all") state.subcategory = "all";
      else {
        const sub = subBySlug(el.dataset.sub);
        state.subcategory = el.dataset.sub;
        if (sub && state.collection !== "all" && sub.collection !== state.collection) state.collection = sub.collection;
      }
      state.limit = PAGE_SIZE; renderBrowse(); return;
    }
    if (el.dataset.finish) {
      state.finish = el.dataset.finish;
      if (state.screen === "product") renderProduct(); else renderWizardAttachments();
      return;
    }
    if (el.dataset.rope) { state.rope = el.dataset.rope; renderProduct(); return; }
    if (el.dataset.stepTo) { state.wizardStep = Number(el.dataset.stepTo); renderWizardSteps(); renderWizardAttachments(); return; }
    if (el.dataset.wizardColl) {
      const s = el.dataset.wizardColl;
      if (state.wizardCollections.has(s)) state.wizardCollections.delete(s);
      else state.wizardCollections.add(s);
      renderWizardAttachments();
      return;
    }
  });

  byId("pd-add").addEventListener("click", () => { if (state.productId) toggleSelection(state.productId); });
  byId("pd-inquire").addEventListener("click", () => {
    if (state.productId && !state.selection.has(state.productId)) toggleSelection(state.productId);
    state.wizardStep = 4; go("#/inquiry");
  });

  byId("lang-toggle").addEventListener("click", () => setLang(state.lang === "en" ? "zh" : "en"));
  byId("footer-lang").addEventListener("click", () => setLang(state.lang === "en" ? "zh" : "en"));

  byId("mega-toggle").addEventListener("click", () => {
    const open = byId("mega").hidden;
    byId("mega").hidden = !open;
    byId("mega-toggle").setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (ev) => {
    if (!byId("mega").hidden && !ev.target.closest("#mega") && !ev.target.closest("#mega-toggle")) closeMega();
  });
  byId("menu-toggle").addEventListener("click", () => {
    const nav = byId("mobile-nav");
    const open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    byId("menu-toggle").setAttribute("aria-expanded", String(open));
  });

  let searchTimer;
  byId("browse-search").addEventListener("input", (ev) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { state.query = ev.target.value; state.limit = PAGE_SIZE; renderBrowse(); }, 140);
  });
  byId("browse-sort").addEventListener("change", (ev) => { state.sort = ev.target.value; renderBrowse(); });
  byId("load-more").addEventListener("click", () => { state.limit += PAGE_SIZE; renderBrowse(); });
  const resetFilters = () => {
    state.collection = "all"; state.subcategory = "all"; state.query = ""; state.limit = PAGE_SIZE;
    byId("browse-search").value = ""; renderBrowse();
  };
  byId("reset-filters").addEventListener("click", resetFilters);
  byId("empty-reset").addEventListener("click", resetFilters);

  byId("selection-btn").addEventListener("click", () => {
    byId("drawer-layer").hidden = false;
    document.body.style.overflow = "hidden";
    byId("drawer-close").focus();
  });
  const closeDrawer = () => {
    byId("drawer-layer").hidden = true;
    document.body.style.overflow = "";
    byId("selection-btn").focus();
  };
  byId("drawer-close").addEventListener("click", closeDrawer);
  byId("drawer-scrim").addEventListener("click", closeDrawer);
  byId("drawer-body").addEventListener("change", (ev) => {
    const input = ev.target.closest("[data-qty]");
    if (!input) return;
    // Sets are whole units — "1.5 sets" would go out on a real quotation.
    // Normalise and write the clean value back so the field matches what we send.
    const qty = Math.min(99999, Math.max(1, Math.round(Number(input.value) || 1)));
    input.value = String(qty);
    state.selection.set(input.dataset.qty, qty);
    saveSelection();
  });
  byId("drawer-quote").addEventListener("click", () => {
    closeDrawer(); state.wizardStep = 4; go("#/inquiry");
  });

  byId("wizard-prev").addEventListener("click", () => {
    if (state.wizardStep > 1) { state.wizardStep--; renderWizardSteps(); renderWizardAttachments(); }
  });
  byId("wizard-form").addEventListener("submit", (ev) => {
    ev.preventDefault();
    if (state.wizardStep < 4) { state.wizardStep++; renderWizardSteps(); renderWizardAttachments(); return; }
    const f = ev.currentTarget;
    const phone = f.elements.phone, name = f.elements.name;
    let ok = true;
    [phone, name].forEach((el) => {
      const bad = !String(el.value || "").trim();
      el.classList.toggle("invalid", bad);
      if (bad) ok = false;
    });
    byId("phone-error").hidden = !!String(phone.value || "").trim();
    if (!ok) { (String(name.value || "").trim() ? phone : name).focus(); return; }
    const msg = wizardMessage();
    const ref = "KD-2026-" + String(Math.floor(1000 + Math.random() * 9000));
    byId("wizard-ref").textContent = fmt("inquiryRef", { ref });
    byId("wizard-wa").href = wa(msg);
    byId("wizard-done").hidden = false;
    window.open(wa(msg), "_blank", "noopener");
    byId("wizard-done").scrollIntoView({ behavior: "smooth", block: "center" });
  });

  /* ---------------------------------------------------------------- lightbox */
  let lightboxOpener = null;
  function openLightbox(id, capKey, widest) {
    const img = byId("lightbox-img");
    // Load the widest variant that exists for this photo; the sources differ in
    // size so there is no single "large" tier to reach for.
    img.src = `assets/images/projects/${id}-${widest}.webp`;
    img.alt = t(capKey);
    byId("lightbox-cap").textContent = t(capKey);
    byId("lightbox").hidden = false;
    document.body.style.overflow = "hidden";
    byId("lightbox-close").focus();
  }
  function closeLightbox() {
    byId("lightbox").hidden = true;
    byId("lightbox-img").removeAttribute("src");
    document.body.style.overflow = "";
    if (lightboxOpener && lightboxOpener.isConnected) lightboxOpener.focus();
    lightboxOpener = null;
  }
  byId("lightbox-close").addEventListener("click", closeLightbox);
  byId("lightbox-scrim").addEventListener("click", closeLightbox);
  byId("lightbox-close").setAttribute("aria-label", t("close"));

  document.addEventListener("keydown", (ev) => {
    if (ev.key !== "Escape") return;
    if (!byId("lightbox").hidden) closeLightbox();
    else if (!byId("drawer-layer").hidden) closeDrawer();
    else if (!byId("mega").hidden) closeMega();
  });

  window.addEventListener("hashchange", () => route());

  /* -------------------------------------------------------- intro and cursor */
  const intro = byId("intro");
  if (sessionStorage.getItem("kordia-intro") === "seen"
      || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    intro.remove();
  } else {
    sessionStorage.setItem("kordia-intro", "seen");
    setTimeout(() => {
      intro.classList.add("done");
      setTimeout(() => intro.remove(), 900);
    }, 1900);
  }

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches
      && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const dot = byId("cursor"), ring = byId("cursor-ring");
    let rx = -100, ry = -100, x = -100, y = -100;
    document.addEventListener("mousemove", (e) => {
      x = e.clientX; y = e.clientY;
      dot.style.left = `${x}px`; dot.style.top = `${y}px`;
      const over = e.target.closest("a,button,[data-open-product],input,select,textarea");
      ring.classList.toggle("grow", !!over);
    });
    (function loop() {
      rx += (x - rx) * .18; ry += (y - ry) * .18;
      ring.style.left = `${rx}px`; ring.style.top = `${ry}px`;
      requestAnimationFrame(loop);
    })();
  } else {
    byId("cursor").remove(); byId("cursor-ring").remove();
  }

  /* -------------------------------------------------------------------- boot */
  renderAll();
  route(false);
  setHero(0);
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setInterval(() => { if (state.screen === "home") setHero(state.heroIndex + 1); }, 5500);
  }
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1200));
  if (document.readyState === "complete") idle(() => slides.forEach(hydrate));
  else window.addEventListener("load", () => idle(() => slides.forEach(hydrate)), { once: true });
})();
