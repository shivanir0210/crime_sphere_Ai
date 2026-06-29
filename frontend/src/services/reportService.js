import { jsPDF } from 'jspdf';

/**
 * Localized translations map for police reports.
 * Self-contained to guarantee high-fidelity PDF output.
 */
const reportTranslations = {
  en: {
    dept: 'STATE POLICE DEPARTMENT // CRIMESPHERE AI INTEL DIVISION',
    dossier: 'OFFICIAL CASE FILE DOSSIER',
    classification: 'CLASSIFICATION: CONFIDENTIAL // LAW ENFORCEMENT ONLY',
    investigation: 'INVESTIGATION:',
    dateGenerated: 'DATE GENERATED:',
    riskAssessment: 'RISK ASSESSMENT:',
    caseStatus: 'CASE STATUS:',
    activeInquiry: 'ACTIVE INTELLIGENCE INQUIRY',
    execBrief: 'I. EXECUTIVE BRIEF',
    keyFindings: 'II. KEY FINDINGS & CONFLICT DETAILS',
    suspectNetwork: 'III. SUSPECT CO-CONSPIRATORS NETWORK',
    hotspots: 'IV. INCIDENT HOTSPOTS',
    timeline: 'V. CRITICAL INVESTIGATION TIMELINE',
    recommendations: 'VI. ACTIONABLE RECOMMENDATIONS',
    relatedCases: 'VII. RELATED CASE FILE MATCHES',
    footer: 'CRIMESPHERE INTEL DIVISION // INTERNAL USE ONLY',
    page: 'Page',
    of: 'of'
  },
  hi: {
    dept: 'राज्य पुलिस विभाग // क्राइमस्फीयर एआई खुफिया प्रभाग',
    dossier: 'आधिकारिक केस फ़ाइल डोजियर',
    classification: 'वर्गीकरण: गोपनीय // केवल कानून प्रवर्तन के लिए',
    investigation: 'जांच:',
    dateGenerated: 'उत्पन्न तिथि:',
    riskAssessment: 'जोखिम मूल्यांकन:',
    caseStatus: 'केस की स्थिति:',
    activeInquiry: 'सक्रिय खुफिया पूछताछ',
    execBrief: 'I. कार्यकारी संक्षिप्त विवरण',
    keyFindings: 'II. मुख्य निष्कर्ष और संघर्ष विवरण',
    suspectNetwork: 'III. संदिग्ध सह-साजिशकर्ता नेटवर्क',
    hotspots: 'IV. घटना हॉटस्पॉट',
    timeline: 'V. महत्वपूर्ण जांच समयरेखा',
    recommendations: 'VI. कार्रवाई योग्य सिफारिशें',
    relatedCases: 'VII. संबंधित केस फ़ाइल मिलान',
    footer: 'क्राइमस्फीयर खुफिया प्रभाग // केवल आंतरिक उपयोग के लिए',
    page: 'पृष्ठ',
    of: 'का'
  },
  kn: {
    dept: 'ರಾಜ್ಯ ಪೊಲೀಸ್ ಇಲಾಖೆ // ಕ್ರೈಮ್‌ಸ್ಫಿಯರ್ ಎಐ ಇಂಟೆಲ್ ವಿಭಾಗ',
    dossier: 'ಅಧಿಕೃತ ಕೇಸ್ ಫೈಲ್ ಡಾಕ್ಯುಮೆಂಟ್',
    classification: 'ವರ್ಗೀಕರಣ: ಗೌಪ್ಯ // ಕಾನೂನು ಜಾರಿ ಇಲಾಖೆಗೆ ಮಾತ್ರ',
    investigation: 'ತನಿಖೆ:',
    dateGenerated: 'ರಚಿಸಲಾದ ದಿನಾಂಕ:',
    riskAssessment: 'ಅಪಾಯದ ಮೌಲ್ಯಮಾಪನ:',
    caseStatus: 'ಪ್ರಕರಣದ ಸ್ಥಿತಿ:',
    activeInquiry: 'ಸಕ್ರಿಯ ಗುಪ್ತಚರ ವಿಚಾರಣೆ',
    execBrief: 'I. ಕಾರ್ಯನಿರ್ವಾಹಕ ಸಾರಾಂಶ',
    keyFindings: 'II. ಪ್ರಮುಖ ಸಂಶೋಧನೆಗಳು ಮತ್ತು ಸಂಘರ್ಷದ ವಿವರಗಳು',
    suspectNetwork: 'III. ಶಂಕಿತ ಸಹ-ಸಂಚುಗಾರರ ನೆಟ್‌ವರ್ಕ್',
    hotspots: 'IV. ಘಟನೆಯ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳು',
    timeline: 'V. ನಿರ್ಣಾಯಕ ತನಿಖೆಯ ಟೈಮ್‌ಲೈನ್',
    recommendations: 'VI. ಕಾರ್ಯಸಾಧ್ಯವಾದ ಶಿಫಾರಸುಗಳು',
    relatedCases: 'VII. ಸಂಬಂಧಿತ ಪ್ರಕರಣದ ದಾಖಲೆಗಳು',
    footer: 'ಕ್ರೈಮ್‌ಸ್ಫಿಯರ್ ಇಂಟೆಲ್ ವಿಭಾಗ // ಆಂತರಿಕ ಬಳಕೆಗೆ ಮಾತ್ರ',
    page: 'ಪುಟ',
    of: 'ರಲ್ಲಿ'
  },
  ta: {
    dept: 'மாநில காவல் துறை // கிரைம்ஸ்பியர் ஏஐ புலனாய்வு பிரிவு',
    dossier: 'அதிகாரப்பூர்வ வழக்கு கோப்பு டொசியர்',
    classification: 'வகைப்பாடு: ரகசியம் // சட்ட அமலாக்கத்திற்கு மட்டுமே',
    investigation: 'விசாரணை:',
    dateGenerated: 'உருவாக்கப்பட்ட தேதி:',
    riskAssessment: 'அபாய மதிப்பீடு:',
    caseStatus: 'வழக்கு நிலை:',
    activeInquiry: 'செயலில் உள்ள புலனாய்வு விசாரணை',
    execBrief: 'I. நிர்வாக சுருக்கம்',
    keyFindings: 'II. முக்கிய கண்டுபிடிப்புகள் மற்றும் முரண்பாட்டு விவரங்கள்',
    suspectNetwork: 'III. சந்தேகத்திற்குரிய கூட்டுச் சதிகாரர்கள் நெட்வொர்க்',
    hotspots: 'IV. சம்பவ ஹாட்ஸ்பாட்கள்',
    timeline: 'V. முக்கியமான விசாரணை காலவரிசை',
    recommendations: 'VI. பரிந்துரைக்கப்பட்ட நடவடிக்கைகள்',
    relatedCases: 'VII. தொடர்புடைய வழக்கு கோப்பு பொருத்தங்கள்',
    footer: 'கிரைம்ஸ்பியர் இன்டெல் பிரிவு // உள் பயன்பாட்டிற்கு மட்டுமே',
    page: 'பக்கம்',
    of: 'இல்'
  },
  te: {
    dept: 'రాష్ట్ర పోలీసు విభాగం // క్రైమ్‌స్ఫియర్ AI ఇంటెల్ డివిజన్',
    dossier: 'అధికారిక కేస్ ఫైల్ డాసియర్',
    classification: 'వర్గీకరణ: రహస్యం // లా ఎన్‌ఫోర్స్‌మెంట్ మాత్రమే',
    investigation: 'విచారణ:',
    dateGenerated: 'ఉత్పత్తి చేసిన తేదీ:',
    riskAssessment: 'ప్రమాద అంచనా:',
    caseStatus: 'కేసు స్థితి:',
    activeInquiry: 'క్రియాశీల ఇంటెలిజెన్స్ విచారణ',
    execBrief: 'I. ఎగ్జిక్యూటివ్ బ్రీఫ్',
    keyFindings: 'II. முக்கிய పరిశోధనలు & వైరుధ్య వివరాలు',
    suspectNetwork: 'III. అనుమానిత సహ-కుట్రదారుల నెట్‌వర్క్',
    hotspots: 'IV. సంఘటన హాట్‌స్పాట్లు',
    timeline: 'V. కీలక విచారణ కాలక్రమం',
    recommendations: 'VI. సిఫార్సులు',
    relatedCases: 'VII. సంబంధిత కేసు ఫైల్ మ్యాచ్‌లు',
    footer: 'క్రైమ్‌స్ఫియర్ ఇంటెల్ డివిజన్ // అంతర్గత ఉపయోగం మాత్రమే',
    page: 'పేజీ',
    of: 'యొక్క'
  },
  ml: {
    dept: 'സംസ്ഥാന പോലീസ് വകുപ്പ് // ക്രൈംസ്ഫിയർ എഐ ഇൻ്റൽ ഡിവിഷൻ',
    dossier: 'ഔദ്യോഗിക കേസ് ഫയൽ ഡോസിയർ',
    classification: 'വർഗ്ഗീകരണം: രഹസ്യം // നിയമപാലകർക്ക് മാത്രം',
    investigation: 'അന്വേഷണം:',
    dateGenerated: 'തീയതി:',
    riskAssessment: 'അപായ വിലയിരുത്തൽ:',
    caseStatus: 'കേസ് നില:',
    activeInquiry: 'സജീവ ഇന്റലിജൻസ് അന്വേഷണം',
    execBrief: 'I. എക്സിക്യൂട്ടീവ് സംഗ്രഹം',
    keyFindings: 'II. പ്രധാന കണ്ടെത്തലുകളും വിവരങ്ങളും',
    suspectNetwork: 'III. പ്രതികളുടെ ശൃംഖല',
    hotspots: 'IV. ക്രൈം ഹോട്ട്സ്പോട്ടുകൾ',
    timeline: 'V. പ്രധാന അന്വേഷണ സമയരേഖ',
    recommendations: 'VI. ശുപാർശകൾ',
    relatedCases: 'VII. സമാന കേസുകൾ',
    footer: 'ക്രൈംസ്ഫിയർ ഇൻ്റൽ ഡിവിഷൻ // ആന്തരിക ഉപയോഗത്തിന് മാത്രം',
    page: 'പേജ്',
    of: 'ൽ'
  },
  bn: {
    dept: 'রাজ্য পুলিশ বিভাগ // ক্রাইমস্ফিয়ার এআই ইন্টেল বিভাগ',
    dossier: 'অফিসিয়াল কেস ফাইল ডসিয়ার',
    classification: 'শ্রেণীবিভাগ: গোপনীয় // শুধুমাত্র আইন প্রয়োগকারী জন্য',
    investigation: 'তদন্ত:',
    dateGenerated: 'তৈরির তারিখ:',
    riskAssessment: 'ঝুঁকি মূল্যায়ন:',
    caseStatus: 'কেস স্ট্যাটাস:',
    activeInquiry: 'সক্রিয় গোয়েন্দা তদন্ত',
    execBrief: 'I. কার্যনির্বাহী সারসংক্ষেপ',
    keyFindings: 'II. মূল অনুসন্ধান এবং দ্বন্দ্বের বিবরণ',
    suspectNetwork: 'III. সন্দেহভাজন সহযোগী নেটওয়ার্ক',
    hotspots: 'IV. অপরাধের হটস্পট',
    timeline: 'V. গুরুত্বপূর্ণ তদন্তের সময়রেখা',
    recommendations: 'VI. প্রস্তাবিত পদক্ষেপ',
    relatedCases: 'VII. সম্পর্কিত কেস ফাইল মিল',
    footer: 'ক্রাইমস্ফিয়ার ইন্টেল ডিভিশন // শুধুমাত্র অভ্যন্তরীণ ব্যবহারের জন্য',
    page: 'পৃষ্ঠা',
    of: 'এর'
  }
};

/**
 * Report Generation Service for CrimeSphere AI.
 * Exports a professional police report PDF containing case summaries,
 * timelines, risk ratings, and suspect network data in the target language.
 */
export const generatePoliceReport = (data, language = 'en') => {
  try {
    const doc = new jsPDF();
    let y = 20;

    // Resolve translations based on language
    const labels = reportTranslations[language] || reportTranslations['en'];

    // Report Header - Dark Slate block
    doc.setFillColor(15, 23, 42); // Slate primary
    doc.rect(15, y, 180, 18, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(labels.dept, 20, y + 11);
    y += 28;

    // Stamp / Main Title
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.text(labels.dossier, 15, y);
    
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    doc.setFont('Helvetica', 'normal');
    doc.text(labels.classification, 105, y - 1);
    y += 8;

    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.8);
    doc.line(15, y, 195, y);
    y += 10;

    // Metadata Grid
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(labels.investigation, 15, y);
    doc.setFont('Helvetica', 'normal');
    doc.text(data.title || 'General Case File', 48, y);

    doc.setFont('Helvetica', 'bold');
    doc.text(labels.dateGenerated, 125, y);
    doc.setFont('Helvetica', 'normal');
    doc.text(new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 162, y);
    y += 7;

    doc.setFont('Helvetica', 'bold');
    doc.text(labels.riskAssessment, 15, y);
    doc.setFont('Helvetica', 'bold');
    // Color code risk label text in red if High risk
    const isHighRisk = String(data.riskLevel).toLowerCase().includes('high') || (typeof data.riskLevel === 'number' && data.riskLevel > 75);
    if (isHighRisk) {
      doc.setTextColor(239, 68, 68); // Red
    } else {
      doc.setTextColor(245, 158, 11); // Orange
    }
    doc.text(String(data.riskLevel || 'N/A'), 52, y);
    doc.setTextColor(15, 23, 42);

    doc.setFont('Helvetica', 'bold');
    doc.text(labels.caseStatus, 125, y);
    doc.setFont('Helvetica', 'normal');
    doc.text(labels.activeInquiry, 152, y);
    y += 10;

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.25);
    doc.line(15, y, 195, y);
    y += 10;

    // Section header generator
    const addSectionHeader = (titleText) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(37, 99, 235); // Accent blue
      doc.text(titleText, 15, y);
      y += 4;
      doc.setDrawColor(37, 99, 235);
      doc.line(15, y, 195, y);
      y += 8;
    };

    // I. Executive Summary
    addSectionHeader(labels.execBrief);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(50, 50, 50);
    const summaryLines = doc.splitTextToSize(data.summary || 'No summary statement compiled.', 175);
    summaryLines.forEach((line) => {
      if (y > 275) { doc.addPage(); y = 20; }
      doc.text(line, 18, y);
      y += 5.5;
    });
    y += 6;

    // II. Key Findings
    if (data.findings && data.findings.length > 0) {
      addSectionHeader(labels.keyFindings);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(50, 50, 50);
      data.findings.forEach((finding, idx) => {
        if (y > 275) { doc.addPage(); y = 20; }
        doc.text(`[${idx + 1}]  ${finding}`, 18, y);
        y += 6;
      });
      y += 6;
    }

    // III. Suspect Network
    if (data.suspects && data.suspects.length > 0) {
      addSectionHeader(labels.suspectNetwork);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(50, 50, 50);
      data.suspects.forEach((sus, idx) => {
        if (y > 275) { doc.addPage(); y = 20; }
        const textVal = typeof sus === 'object'
          ? `${sus.from} -> [${sus.relation}] -> ${sus.to}`
          : `${idx + 1}. ${sus}`;
        doc.text(`•  ${textVal}`, 18, y);
        y += 6;
      });
      y += 6;
    }

    // IV. Locations Identified
    if (data.locations && data.locations.length > 0) {
      addSectionHeader(labels.hotspots);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(50, 50, 50);
      data.locations.forEach((loc) => {
        if (y > 275) { doc.addPage(); y = 20; }
        const val = typeof loc === 'object' ? `${loc.location} (Risk: ${loc.risk})` : loc;
        doc.text(`📍 ${val}`, 18, y);
        y += 6;
      });
      y += 6;
    }

    // V. Timeline
    if (data.timeline && data.timeline.length > 0) {
      addSectionHeader(labels.timeline);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(50, 50, 50);
      data.timeline.forEach((t) => {
        if (y > 275) { doc.addPage(); y = 20; }
        const timestamp = t.date || t.timestamp || 'Active';
        const desc = t.desc || t.description || t.text || '';
        doc.text(`[${timestamp}] - ${desc}`, 18, y);
        y += 6;
      });
      y += 6;
    }

    // VI. Recommendations
    if (data.recommendations && data.recommendations.length > 0) {
      addSectionHeader(labels.recommendations);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(50, 50, 50);
      data.recommendations.forEach((rec, idx) => {
        if (y > 275) { doc.addPage(); y = 20; }
        doc.text(`${idx + 1}.  ${rec}`, 18, y);
        y += 6;
      });
      y += 6;
    }

    // VII. Related Incidents Traced
    if (data.relatedCases && data.relatedCases.length > 0) {
      addSectionHeader(labels.relatedCases);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(50, 50, 50);
      data.relatedCases.forEach((c) => {
        if (y > 275) { doc.addPage(); y = 20; }
        doc.text(`📁 Case ID: #${c.id} - ${c.title}`, 18, y);
        y += 6;
      });
    }

    // Apply Page Numbers to All Pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      doc.text(`${labels.page} ${i} ${labels.of} ${totalPages}`, 172, 285);
      doc.text(labels.footer, 15, 285);
    }

    doc.save(`CrimeSphere_Police_Report_${(data.title || 'Case').replace(/\s+/g, '_')}.pdf`);
  } catch (err) {
    console.error('Failed to generate police report PDF:', err);
    alert('Error generating Police Report. Please verify connection.');
  }
};
