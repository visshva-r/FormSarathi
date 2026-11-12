import type { FormAnalysis, SampleForm } from "@/types/form";

export const SAMPLE_FORMS: SampleForm[] = [
  {
    id: "scholarship",
    title: "National Merit Scholarship",
    category: "Education",
    description: "Income & academics scholarship form — common for first-gen students.",
  },
  {
    id: "aadhaar-update",
    title: "Aadhaar Address Update",
    category: "Government ID",
    description: "Address correction request with supporting proof.",
  },
  {
    id: "bank-kyc",
    title: "Savings Account KYC",
    category: "Banking",
    description: "Branch KYC refresh for existing account holders.",
  },
  {
    id: "college-admission",
    title: "UG Admission Application",
    category: "Education",
    description: "College entrance + document verification form.",
  },
  {
    id: "ration-scheme",
    title: "PM Garib Kalyan Scheme Notice",
    category: "Public Welfare",
    description: "Free ration eligibility intimation — needs action checklist.",
  },
];

const now = () => new Date().toISOString();

export const SAMPLE_ANALYSES: Record<string, FormAnalysis> = {
  scholarship: {
    formTitle: "National Merit Scholarship Application",
    category: "Education",
    summaryEn:
      "This form applies for a merit-cum-means scholarship. You declare family income, academic scores, and bank details for direct benefit transfer.",
    summaryHi:
      "यह फॉर्म मेरिट-कम-मीन्स छात्रवृत्ति के लिए है। आपको पारिवारिक आय, अंक और बैंक विवरण भरना होगा ताकि राशि सीधे खाते में मिल सके।",
    sections: [
      {
        title: "Applicant Details",
        meaningEn: "Your name, roll number, institution, and contact must match school records.",
        meaningHi: "नाम, रोल नंबर, संस्थान और संपर्क स्कूल रिकॉर्ड से मेल खाना चाहिए।",
      },
      {
        title: "Income Declaration",
        meaningEn: "Parent/guardian annual income; may require income certificate if above threshold.",
        meaningHi: "अभिभावक की वार्षिक आय; सीमा से अधिक होने पर आय प्रमाण पत्र लगेगा।",
      },
      {
        title: "Academic Performance",
        meaningEn: "Last exam percentage/CGPA — usually minimum cutoff applies.",
        meaningHi: "पिछली परीक्षा के प्रतिशत/CGPA — न्यूनतम अंक जरूरी हो सकते हैं।",
      },
    ],
    checklist: [
      { step: 1, action: "Collect income certificate (if applicable) and marksheet.", actionHi: "आय प्रमाण (यदि लागू) और मार्कशीट इकट्ठा करें।" },
      { step: 2, action: "Fill personal details exactly as on Aadhaar.", actionHi: "विवरण आधार जैसा ही भरें।" },
      { step: 3, action: "Attach scanned copies (PDF under size limit).", actionHi: "स्कैन की प्रति PDF में संलग्न करें।" },
      { step: 4, action: "Get institution seal/signature on verification page.", actionHi: "सत्यापन पृष्ठ पर संस्थान की मुहर/हस्ताक्षर लें।" },
      { step: 5, action: "Submit before portal deadline and save acknowledgment.", actionHi: "अंतिम तिथि से पहले जमा करें और पावती सहेजें।" },
    ],
    requiredDocuments: [
      "Aadhaar card",
      "Previous year marksheet",
      "Income certificate (if required)",
      "Bank passbook / cancelled cheque",
      "Passport-size photograph",
    ],
    pitfalls: [
      "Name mismatch between Aadhaar and marksheet",
      "Blurry scans rejected by portal",
      "Wrong IFSC or account number for DBT",
    ],
    fields: [
      { id: "name", label: "Full name (as per Aadhaar)", suggestedAnswer: "[Your full legal name]" },
      { id: "income", label: "Annual family income (INR)", suggestedAnswer: "[Amount from income certificate]" },
      { id: "percentage", label: "Last exam aggregate %", suggestedAnswer: "[e.g. 87.4%]" },
      { id: "bank", label: "Bank account for scholarship credit", suggestedAnswer: "[Account no. + IFSC]" },
    ],
    generatedAt: now(),
  },
  "aadhaar-update": {
    formTitle: "Aadhaar Address Update Request",
    category: "Government ID",
    summaryEn:
      "Use this to change your Aadhaar registered address. You must submit valid address proof listed by UIDAI.",
    summaryHi:
      "इससे आधार में पंजीबद्ध पता बदला जाता है। UIDAI की सूची में से मान्य पते का प्रमाण जरूरी है।",
    sections: [
      {
        title: "Aadhaar Number",
        meaningEn: "12-digit Aadhaar; mobile OTP may be used for authentication.",
        meaningHi: "12 अंकों का आधार; सत्यापन के लिए मोबाइल OTP लग सकता है।",
      },
      {
        title: "New Address",
        meaningEn: "Complete address with PIN code — must match proof document.",
        meaningHi: "पूरा पता पिन कोड सहित — प्रमाण पत्र से मेल खाना चाहिए।",
      },
    ],
    checklist: [
      { step: 1, action: "Choose valid address proof (ration card, utility bill, etc.).", actionHi: "मान्य पते का प्रमाण चुनें (राशन कार्ड, बिजली बिल आदि)।" },
      { step: 2, action: "Fill new address line-by-line as on proof.", actionHi: "नया पता प्रमाण जैसा लिखें।" },
      { step: 3, action: "Upload clear scan of proof (both sides if needed).", actionHi: "प्रमाण की स्पष्ट स्कैन अपलोड करें।" },
      { step: 4, action: "Book appointment or visit enrolment center if offline.", actionHi: "ऑफलाइन हो तो अपॉइंटमेंट लें या केंद्र जाएं।" },
    ],
    requiredDocuments: ["Aadhaar", "Address proof (UIDAI accepted list)", "Mobile linked to Aadhaar"],
    pitfalls: ["Proof older than allowed months", "Partial address on form", "Name on proof doesn't match"],
    fields: [
      { id: "aadhaar", label: "Aadhaar number", suggestedAnswer: "XXXX XXXX [last 4]" },
      { id: "address", label: "New full address", suggestedAnswer: "[House no., street, city, state, PIN]" },
    ],
    generatedAt: now(),
  },
  "bank-kyc": {
    formTitle: "Savings Account KYC Update",
    category: "Banking",
    summaryEn: "Periodic KYC refresh: identity, address, occupation, and FATCA declaration for your savings account.",
    summaryHi: "बचत खाते का KYC नवीनीकरण: पहचान, पता, व्यवसाय और FATCA घोषणा।",
    sections: [
      { title: "Identity", meaningEn: "PAN + Aadhaar or passport as per bank policy.", meaningHi: "बैंक नीति के अनुसार PAN + आधार या पासपोर्ट।" },
      { title: "FATCA", meaningEn: "Declare if you are tax resident only in India.", meaningHi: "घोषणा करें कि आप केवल भारत के टैक्स रेजिडेंट हैं।" },
    ],
    checklist: [
      { step: 1, action: "Carry original ID to branch if in-person.", actionHi: "शाखा में मूल ID साथ लाएं।" },
      { step: 2, action: "Update mobile/email for OTP alerts.", actionHi: "OTP के लिए मोबाइल/ईमेल अपडेट करें।" },
      { step: 3, action: "Sign form where marked; attach self-attested copies.", actionHi: "चिह्नित स्थान पर हस्ताक्षर; स्वयं सत्यापित प्रति लगाएं।" },
    ],
    requiredDocuments: ["PAN", "Aadhaar", "Address proof", "Recent photograph"],
    pitfalls: ["Unsigned FATCA page", "Expired address proof"],
    fields: [
      { id: "account", label: "Account number", suggestedAnswer: "[Your savings account number]" },
      { id: "occupation", label: "Occupation / source of funds", suggestedAnswer: "[Student / Salaried / Business]" },
    ],
    generatedAt: now(),
  },
  "college-admission": {
    formTitle: "Undergraduate Admission Form",
    category: "Education",
    summaryEn: "Application for UG program including course preference, category certificate, and entrance exam roll number.",
    summaryHi: "स्नातक प्रवेश फॉर्म — पाठ्यक्रम पसंद, श्रेणी प्रमाणपत्र और प्रवेश परीक्षा रोल नंबर।",
    sections: [
      { title: "Course Preference", meaningEn: "Order of programs matters for allotment.", meaningHi: "कार्यक्रम की प्राथमिकता क्रम महत्वपूर्ण है।" },
      { title: "Category", meaningEn: "SC/ST/OBC/EWS — certificate number and issuing authority.", meaningHi: "श्रेणी प्रमाणपत्र नंबर और जारीकर्ता विवरण।" },
    ],
    checklist: [
      { step: 1, action: "Verify entrance exam score sync on portal.", actionHi: "पोर्टल पर परीक्षा स्कोर मिलान करें।" },
      { step: 2, action: "Upload category certificate if claiming reservation.", actionHi: "आरक्षण के लिए प्रमाणपत्र अपलोड करें।" },
      { step: 3, action: "Pay application fee and download receipt.", actionHi: "शुल्क भरें और रसीद डाउनलोड करें।" },
    ],
    requiredDocuments: ["Entrance hall ticket", "Class 12 marksheet", "Category certificate (if any)", "Photo & signature scan"],
    pitfalls: ["Wrong preference order", "Certificate not valid for current year"],
    fields: [
      { id: "roll", label: "Entrance exam roll number", suggestedAnswer: "[Roll from admit card]" },
      { id: "pref1", label: "First course preference", suggestedAnswer: "[e.g. B.Tech CSE]" },
    ],
    generatedAt: now(),
  },
  "ration-scheme": {
    formTitle: "PM Garib Kalyan — Ration Eligibility Intimation",
    category: "Public Welfare",
    summaryEn: "Notice informing eligible families about enhanced free ration; may require confirmation of Ration card details at Fair Price Shop.",
    summaryHi: "पात्र परिवारों को मुफ्त राशन की सूचना; FPS पर राशन कार्ड विवरण की पुष्टि जरूरी हो सकती है।",
    sections: [
      { title: "Household ID", meaningEn: "Ration card / NFSA ID linked to your household.", meaningHi: "परिवार से जुड़ा राशन कार्ड / NFSA ID।" },
    ],
    checklist: [
      { step: 1, action: "Carry Aadhaar of all members mentioned on card.", actionHi: "कार्ड पर सभी सदस्यों का आधार साथ लें।" },
      { step: 2, action: "Visit assigned Fair Price Shop on notified dates.", actionHi: "निर्धारित तिथि पर FPS जाएं।" },
      { step: 3, action: "Verify mobile seeded for SMS alerts.", actionHi: "SMS अलर्ट के लिए मोबाइल सीडेड हो।" },
    ],
    requiredDocuments: ["Ration card", "Aadhaar cards of members"],
    pitfalls: ["Visiting wrong FPS", "Card not updated after migration"],
    fields: [
      { id: "rc", label: "Ration card number", suggestedAnswer: "[Number from card]" },
      { id: "fps", label: "Fair Price Shop code", suggestedAnswer: "[Local FPS ID]" },
    ],
    generatedAt: now(),
  },
};
