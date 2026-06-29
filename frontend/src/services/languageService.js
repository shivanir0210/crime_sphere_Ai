/**
 * Language Service for CrimeSphere AI.
 * Handles language detection, translation, and local storage state persistence.
 */

import { translations } from '../utils/translations';

const LANGUAGE_KEY = 'crimesphere_language';

export const getCurrentLanguage = () => {
  try {
    return localStorage.getItem(LANGUAGE_KEY) || 'en';
  } catch {
    return 'en';
  }
};

export const setCurrentLanguage = (lang) => {
  try {
    localStorage.setItem(LANGUAGE_KEY, lang);
  } catch (e) {
    console.error('Error saving language selection:', e);
  }
};

/**
 * Unicode-based script detector for Indian scripts and English.
 */
export const detectLanguage = (text) => {
  if (!text) return 'en';

  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn'; // Kannada
  if (/[\u0900-\u097F]/.test(text)) return 'hi'; // Hindi
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta'; // Tamil
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te'; // Telugu
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml'; // Malayalam
  if (/[\u0980-\u09FF]/.test(text)) return 'bn'; // Bengali

  return 'en';
};

// Comprehensive Master Translations Dictionary for 6 core languages
const masterDictionary = {
  // Hindi Mappings
  hi: {
    // Query Mappings
    'show repeat offenders': 'बार-बार अपराध करने वाले दिखाएं',
    'show repeat offenders in bengaluru': 'बेंगलुरु में बार-बार अपराध करने वालों को दिखाएं',
    'only in bengaluru': 'केवल बेंगलुरु में',
    'only in mysuru': 'केवल मैसूरु में',
    'show crime hotspots': 'अपराध हॉटस्पॉट दिखाएं',
    'show cybercrime cases': 'साइबर अपराध के मामले दिखाएं',
    'show financial fraud suspects': 'वित्तीय धोखाधड़ी के संदिग्धों को दिखाएं',
    'show high risk offenders': 'उच्च जोखिम वाले अपराधियों को दिखाएं',
    'find linked cases': 'संबद्ध मामले खोजें',
    'find suspects connected to cyber fraud': 'साइबर धोखाधड़ी से जुड़े संदिग्धों का पता लगाएं',

    // Verbal Replies & Summaries
    'found 2 repeat offenders active in bengaluru: kiran kumar and rajesh sekhar': 'बेंगलुरु में सक्रिय 2 बार-बार अपराध करने वाले मिले: किरण कुमार और राजेश शेखर।',
    'filtered 2 repeat offenders linked to bengaluru majestic transit logs and local precincts': 'बेंगलुरु मजेस्टिक ट्रांजिट लॉग और स्थानीय थानों से जुड़े 2 बार-बार अपराध करने वालों को फ़िल्टर किया गया।',
    'found 3 suspects connected to cyber fraud ring': 'साइबर धोखाधड़ी गिरोह से जुड़े 3 संदिग्ध मिले।',
    'suspect network analysis shows coordination on upi spoofing and mule bank accounts': 'संदिग्ध नेटवर्क विश्लेषण यूपीआई स्पूफिंग और म्यूट बैंक खातों पर समन्वय दिखाता है।',
    'cybercrime complaints increased by 18% this month, primarily upi phishing': 'इस महीने साइबर अपराध की शिकायतों में 18% की वृद्धि हुई है, मुख्य रूप से यूपीआई फ़िशिंग।',
    'cybercrime complaints increased by 18% this month, primarily upi phishing and credentials harvesting': 'इस महीने साइबर अपराध की शिकायतों में 18% की वृद्धि हुई है, मुख्य रूप से यूपीआई फ़िशिंग और क्रेडेंशियल हैकिंग।',
    'suspicious transactions identified across 5 accounts linked to suspect nodes': 'संदिग्ध नोड्स से जुड़े 5 खातों में संदिग्ध लेनदेन की पहचान की गई।',
    'suspicious transactions identified across 5 bank accounts representing layered shell entities': 'स्तरित शेल संस्थाओं का प्रतिनिधित्व करने वाले 5 बैंक खातों में संदिग्ध लेनदेन की पहचान की गई।',
    'detected active burglary syndicate with elevated risk score': 'बढ़े हुए जोखिम स्कोर के साथ सक्रिय चोरी सिंडिकेट का पता चला।',
    'burglary and fencing syndicate active on city borders with a high-risk score of 95/100': '95/100 के उच्च जोखिम स्कोर के साथ शहर की सीमाओं पर चोरी और चोरी का माल बेचने वाला सिंडिकेट सक्रिय है।',
    'identified cross-jurisdictional links between 3 active theft investigations': '3 सक्रिय चोरी जांचों के बीच अंतर-क्षेत्रीय संबंधों की पहचान की गई।',
    'cross-jurisdictional correlation shows same modus operandi across majestic and mysuru cases': 'अंतर-क्षेत्रीय सहसंबंध मजेस्टिक और मैसूरु मामलों में एक ही कार्यप्रणाली (Modus Operandi) दिखाता है।',
    'analyzing available crime intelligence data': 'उपलब्ध अपराध खुफिया डेटा का विश्लेषण किया जा रहा है।',
    'analyzing available crime intelligence data in databases no active alert thresholds triggered': 'डेटाबेस में उपलब्ध अपराध खुफिया डेटा का विश्लेषण किया जा रहा है। कोई सक्रिय चेतावनी सीमा नहीं पाई गई।',

    // Reasoning Points
    'linked to 4 bengaluru majestic fir files': '4 बेंगलुरु मजेस्टिक प्राथमिकी (FIR) फाइलों से जुड़ा है',
    'appeared in bengaluru hotspot zones (majestic, kr market)': 'बेंगलुरु हॉटस्पॉट क्षेत्रों (मजेस्टिक, केआर मार्केट) में देखा गया',
    'observed coordinates correlation': 'समन्वय (Coordinates) सहसंबंध देखा गया',
    'direct call log matches to offshore hosts': 'अपतटीय (Offshore) होस्टों के साथ सीधे कॉल लॉग मेल खाते हैं',
    'wired funds to mule networks': 'म्यूल नेटवर्क को फंड ट्रांसफर किया गया',
    'ip matches on spoof admin accounts': 'स्पूप एडमिन खातों पर आईपी एड्रेस मेल खाते हैं',
    'spike in credential phishing urls detected': 'क्रेडेंशियल फ़िशिंग यूआरएल में उछाल देखा गया',
    'proxy servers traced to foreign domains': 'विदेशी डोमेन से जुड़े प्रॉक्सी सर्वर का पता चला',
    'upi spoof applications identified': 'यूपीआई स्पूफ एप्लिकेशन की पहचान की गई',
    'rapid transit of funds across shell entities': 'शेल संस्थाओं में तेजी से फंड का ट्रांसफर',
    'amounts structured below reporting limits': 'रिपोर्टिंग सीमा से नीचे संरचित राशि',
    'linked to known financial fraud offenders': 'ज्ञात वित्तीय धोखाधड़ी अपराधियों से जुड़ा है',
    'direct links between 7 co-conspirators': '7 सह-साजिशकर्ताओं के बीच सीधा संबंध',
    'shared communications logs during crimes': 'अपराधों के दौरान साझा संचार लॉग',
    'fencing operations located on city perimeter': 'शहर की सीमा पर स्थित चोरी का माल ठिकाने लगाने का केंद्र',
    'similar lock-breaking tools used': 'ताला तोड़ने के एक जैसे उपकरणों का उपयोग',
    'offender coordinates match transit logs': 'अपराधी के निर्देशांक (Coordinates) पारगमन लॉग से मेल खाते हैं',
    'related fence networks observed': 'चोरी का माल ठिकाने लगाने वाले संबंधित नेटवर्क देखे गए',
    'no prior conviction match identified': 'कोई पूर्व दोषसिद्धि मेल नहीं पाई गई',
    'current location outside identified hotspot areas': 'वर्तमान स्थान पहचाने गए हॉटस्पॉट क्षेत्रों से बाहर है',
    'no direct links to active suspects found': 'सक्रिय संदिग्धों से कोई सीधा संबंध नहीं मिला',

    // Recommendations
    'audit majestic transit logs': 'मजेस्टिक पारगमन लॉग का ऑडिट करें',
    'establish night watch at majestic bus stand': 'मजेस्टिक बस स्टैंड पर रात्रि गश्त स्थापित करें',
    'freeze mule bank accounts': 'म्यूल बैंक खातों को फ्रीज करें',
    'subpoena gateway communication logs': 'गेटवे संचार लॉग को अदालत द्वारा तलब (Subpoena) करें',
    'subpoena server host logs': 'सर्वर होस्ट लॉग को अदालत द्वारा तलब करें',
    'notify banking upi gateways': 'बैंकिंग यूपीआई गेटवे को सूचित करें',
    'request dns takedown of phishing domain': 'फ़िशिंग डोमेन को डीएनएस से हटाने का अनुरोध करें',
    'notify financial intelligence unit': 'वित्तीय खुफिया इकाई (FIU) को सूचित करें',
    'freeze beneficiary accounts': 'लाभार्थी खातों को फ्रीज करें',
    'execute simultaneous warrants': 'एक साथ वारंट निष्पादित करें',
    'block asset sales channels': 'संपत्ति बिक्री चैनलों को ब्लॉक करें',
    'audit shared fencing accounts': 'चोरी का माल बेचने वाले साझा खातों का ऑडिट करें',
    'coordinate across precinct teams': 'थाना टीमों के बीच समन्वय स्थापित करें',
    'monitor local precinct registries': 'स्थानीय थाना रजिस्ट्रियों की निगरानी करें',
    'verify identification documents': 'पहचान दस्तावेजों को सत्यापित करें',

    // Hotspot Locations & Risks
    'bengaluru majestic': 'बेंगलुरु मजेस्टिक',
    'kr market hub': 'केआर मार्केट हब',
    'electronic city tech zone': 'इलेक्ट्रॉनिक सिटी टेक जोन',
    'whitefield hub': 'व्हाइटफील्ड हब',
    'electronic city': 'इलेक्ट्रॉनिक सिटी',
    'central business district': 'केंद्रीय व्यावसायिक जिला',
    'offshore node traces': 'अपतटीय नोड निशान',
    'bengaluru outer ring': 'बेंगलुरु आउटर रिंग',
    'mysuru highway': 'मैसूरु राजमार्ग',
    'mysuru junction': 'मैसूरु जंक्शन',
    'hubli junction': 'हुबली जंक्शन',
    'high': 'उच्च',
    'medium': 'मध्यम',
    'low': 'कम',

    // Network Node Labels & Relations
    'co-accused ↕': 'सह-आरोपी ↕',
    'suspect c (phisher)': 'संदिग्ध सी (फ़िशर)',
    'wire transfer ↕': 'वायर ट्रांसफर ↕',
    'mule account group': 'म्यूल खाता समूह',
    'call log ↕': 'कॉल लॉग ↕',
    'offshore node x': 'अपतटीय नोड एक्स',
    'upi spoof server': 'यूपीआई स्पूफ सर्वर',
    'hosted domain ↕': 'होस्टेड डोमेन ↕',
    'suspect c': 'संदिग्ध सी',
    'recruiter ↕': 'भर्तीकर्ता ↕',
    'sender account': 'प्रेषक खाता',
    'mule account a': 'म्यूल खाता ए',
    'atm cashout ↕': 'एटीएम कैशआउट ↕',
    'suspect node x': 'संदिग्ध नोड एक्स',
    'suspect a': 'संदिग्ध ए',
    'suspect b': 'संदिग्ध बी',
    'asset dump ↕': 'संपत्ति बेचना ↕',
    'unknown node': 'अज्ञान नोड',
    'indirect link ↕': 'अप्रत्यक्ष संबंध ↕',
    'query subject': 'पूछताछ विषय',
    'associate ↕': 'सहयोगी ↕',

    // Historical Cases
    'kr market theft case #809': 'केआर मार्केट चोरी का मामला #809',
    'upi phishing scam #101': 'यूपीआई फ़िशिंग घोटाला #101',
    'bank spoofing investigation #202': 'बैंक स्पूपिंग जांच #202',
    'upi scam #305': 'यूपीआई घोटाला #305',
    'layering scheme #302': 'लेयरिंग योजना #302',
    'mule network investigation #909': 'म्यूल नेटवर्क जांच #909',
    'burglary syndicate ring #110': 'चोरी सिंडिकेट रिंग #110',
    'mysuru handbag snatching #402': 'मैसूरु हैंडबैग छीनने का मामला #402',
    'general investigation #404': 'सामान्य जांच #404',

    // Action Chips
    'show linked suspects': 'जुड़े संदिग्धों को दिखाएं',
    'view crime locations': 'अपराध के स्थानों को देखें',
    'check previous firs': 'पिछली प्राथमिकी की जांच करें',
    'generate report': 'रिपोर्ट बनाएं',
    'view related cases': 'संबंधित मामलों को देखें',
    'analyze risk score': 'जोखिम स्कोर का विश्लेषण करें',
    '✓ show linked suspects': '✓ जुड़े संदिग्धों को दिखाएं',
    '✓ view crime locations': '✓ अपराध के स्थानों को देखें',
    '✓ check previous firs': '✓ पिछली प्राथमिकी की जांच करें',
    '✓ generate report': '✓ रिपोर्ट बनाएं',
    '✓ freeze beneficiary accounts': '✓ लाभार्थी खातों को फ्रीज करें',
    '✓ view related cases': '✓ संबंधित मामलों को देखें',
    '✓ analyze risk score': '✓ जोखिम स्कोर का विश्लेषण करें',

    // Default Hotspot Locations
    'bengaluru urban': 'बेंगलुरु अर्बन',
    'mysuru': 'मैसूरु',
    'hubli': 'हुबली',

    // Timeline Milestone Events
    'fir registered': 'प्राथमिकी (FIR) दर्ज की गई',
    'case recorded in precinct file.': 'मामला थाने की फाइल में दर्ज किया गया।',
    'suspect cross-referenced': 'संदिग्ध का प्रति-संदर्भ किया गया',
    'identified offender records in database.': 'डेटाबेस में अपराधी के रिकॉर्ड की पहचान की गई।',
    'prior convictions fetched': 'पूर्व दोषसिद्धि विवरण प्राप्त किए गए',
    'retrieved 3 historical arrest reports.': '3 ऐतिहासिक गिरफ्तारी रिपोर्ट प्राप्त की गईं।',
    'watchlist updated': 'निगरानी सूची (Watchlist) अपडेट की गई',
    'placed suspect under active surveillance.': 'संदिग्ध को सक्रिय निगरानी में रखा गया।',
    'credential harvesting alert': 'क्रेडेंशियल हार्वेस्टिंग अलर्ट',
    'victim reported credential phishing site.': 'पीड़ित ने क्रेडेंशियल फ़िशिंग साइट की रिपोर्ट की।',
    'ip addresses decrypted': 'आईपी पते डिक्रिप्ट किए गए',
    'traced proxy originating headers.': 'प्रॉक्सी के मूल हेडर का पता लगाया गया।',
    'accounts flagged': 'खाते चिह्नित (Flag) किए गए',
    'flagged 5 target transaction accounts.': '5 लक्षित लेनदेन खातों को चिह्नित किया गया।',
    'assets frozen': 'संपत्ति जब्त की गई',
    'secured court warrant to hold target assets.': 'लक्षित संपत्तियों को रोकने के लिए अदालती वारंट प्राप्त किया।',
    'syndicate profile created': 'सिंडिकेट प्रोफाइल बनाई गई',
    'linked suspect phone exchanges mapped.': 'संबद्ध संदिग्धों के फोन एक्सचेंजों का नक्शा तैयार किया गया।',
    'log subpoenas served': 'लॉग समन (Subpoena) भेजे गए',
    'call data records subpoenaed for 7 nodes.': '7 नोड्स के लिए कॉल डेटा रिकॉर्ड समन किए गए।',
    'syndicate tree plotted': 'सिंडिकेट ट्री का आलेखन किया गया',
    'linked suspect map registered in case file.': 'संबद्ध संदिग्धों का नक्शा केस फाइल में दर्ज किया गया।',
    'warrants issued': 'वारंट जारी किए गए',
    'magistrate signed search and capture warrants.': 'मजिस्ट्रेट ने तलाशी और गिरफ्तारी वारंट पर हस्ताक्षर किए।',
    'clustered rates logged': 'क्लस्टर दरें दर्ज की गईं',
    'incident rates tracked in majestic bus stand.': 'मजेस्टिक बस स्टैंड में घटना दरों पर नज़र रखी गई।',
    'patrol dispatch alert': 'गश्त भेजने का अलर्ट',
    'increased tactical sweeps dispatched to target areas.': 'लक्षित क्षेत्रों में सामरिक गश्त बढ़ाई गई।',
    'hotspots model updated': 'हॉटस्पॉट मॉडल अपडेट किया गया',
    'patrol map routes recalculated.': 'गश्त के नक्शे के मार्गों की पुनर्गणना की गई।',
    'crime rates reduced': 'अपराध दर में कमी आई',
    'local precinct reported 30% reduction in local thefts.': 'स्थानीय थाने ने स्थानीय चोरियों में 30% कमी की रिपोर्ट दी।'
  },

  // Kannada Mappings
  kn: {
    // Query Mappings
    'show repeat offenders': 'ಪುನರಾವರ್ತಿತ ಅಪರಾಧಿಗಳನ್ನು ತೋರಿಸಿ',
    'show repeat offenders in bengaluru': 'ಬೆಂಗಳೂರಿನಲ್ಲಿ ಪುನರಾವರ್ತಿತ ಅಪರಾಧಿಗಳನ್ನು ತೋರಿಸಿ',
    'only in bengaluru': 'ಬೆಂಗಳೂರಿನಲ್ಲಿ ಮಾತ್ರ',
    'only in mysuru': 'ಮೈಸೂರಿನಲ್ಲಿ ಮಾತ್ರ',
    'show crime hotspots': 'ಅಪರಾಧದ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳನ್ನು ತೋರಿಸಿ',
    'show cybercrime cases': 'ಸೈಬರ್ ಅಪರಾಧ ಪ್ರಕರಣಗಳನ್ನು ತೋರಿಸಿ',
    'show financial fraud suspects': 'ಹಣಕಾಸು ವಂಚನೆ ಶಂಕಿತರನ್ನು ತೋರಿಸಿ',
    'show high risk offenders': 'ಹೆಚ್ಚಿನ ಅಪಾಯದ ಅಪರಾಧಿಗಳನ್ನು ತೋರಿಸಿ',
    'find linked cases': 'ಸಂಬಂಧಿತ ಪ್ರಕರಣಗಳನ್ನು ಹುಡುಕಿ',
    'find suspects connected to cyber fraud': 'ಸೈಬರ್ ವಂಚನೆಗೆ ಸಂಬಂಧಿಸಿದ ಶಂಕಿತರನ್ನು ಹುಡುಕಿ',

    // Verbal Replies & Summaries
    'found 2 repeat offenders active in bengaluru: kiran kumar and rajesh sekhar': 'ಬೆಂಗಳೂರಿನಲ್ಲಿ ಸಕ್ರಿಯರಾಗಿರುವ 2 ಪುನರಾವರ್ತಿತ ಅಪರಾಧಿಗಳು ಪತ್ತೆಯಾಗಿದ್ದಾರೆ: ಕಿರಣ್ ಕುಮಾರ್ ಮತ್ತು ರಾಜೇಶ್ ಶೇಖರ್.',
    'filtered 2 repeat offenders linked to bengaluru majestic transit logs and local precincts': 'ಬೆಂಗಳೂರು ಮೆಜೆಸ್ಟಿಕ್ ಸಾರಿಗೆ ದಾಖಲೆಗಳು ಮತ್ತು ಸ್ಥಳೀಯ ಠಾಣೆಗಳಿಗೆ ಲಿಂಕ್ ಮಾಡಲಾದ 2 ಪುನರಾವರ್ತಿತ ಅಪರಾಧಿಗಳನ್ನು ಫಿಲ್ಟರ್ ಮಾಡಲಾಗಿದೆ.',
    'found 3 suspects connected to cyber fraud ring': 'ಸೈಬರ್ ವಂಚನೆ ಜಾಲಕ್ಕೆ ಸಂಬಂಧಿಸಿದ 3 ಶಂಕಿತರು ಪತ್ತೆಯಾಗಿದ್ದಾರೆ.',
    'suspect network analysis shows coordination on upi spoofing and mule bank accounts': 'ಶಂಕಿತ ನೆಟ್‌ವರ್ಕ್ ವಿಶ್ಲೇಷಣೆಯು ಯುಪಿಐ ವಂಚನೆ ಮತ್ತು ಮ್ಯೂಲ್ ಬ್ಯಾಂಕ್ ಖಾತೆಗಳ ನಡುವಿನ ಸಮನ್ವಯವನ್ನು ತೋರಿಸುತ್ತದೆ.',
    'cybercrime complaints increased by 18% this month, primarily upi phishing': 'ಈ ತಿಂಗಳು ಸೈಬರ್ ಅಪರಾಧ ದೂರುಗಳು 18% ಹೆಚ್ಚಾಗಿದೆ, ಮುಖ್ಯವಾಗಿ ಯುಪಿಐ ಫಿಶಿಂಗ್.',
    'cybercrime complaints increased by 18% this month, primarily upi phishing and credentials harvesting': 'ಈ ತಿಂಗಳು ಸೈಬರ್ ಅಪರಾಧ ದೂರುಗಳು 18% ಹೆಚ್ಚಾಗಿದೆ, ಮುಖ್ಯವಾಗಿ ಯುಪಿಐ ಫಿಶಿಂಗ್ ಮತ್ತು ಕ್ರೆಡೆನ್ಶಿಯಲ್ ಫೈಲ್ ಸಂಗ್ರಹಣೆ.',
    'suspicious transactions identified across 5 accounts linked to suspect nodes': 'ಶಂಕಿತ ನೋಡ್‌ಗಳಿಗೆ ಲಿಂಕ್ ಮಾಡಲಾದ 5 ಖಾತೆಗಳಲ್ಲಿ ಶಂಕಾಸ್ಪದ ವಹಿವಾಟುಗಳು ಪತ್ತೆಯಾಗಿವೆ.',
    'suspicious transactions identified across 5 bank accounts representing layered shell entities': 'ಲೇಯರ್ಡ್ ಶೆಲ್ ಘಟಕಗಳನ್ನು ಪ್ರತಿನಿಧಿಸುವ 5 ಬ್ಯಾಂಕ್ ಖಾತೆಗಳಲ್ಲಿ ಶಂಕಾಸ್ಪದ ವಹಿವಾಟುಗಳು ಪತ್ತೆಯಾಗಿವೆ.',
    'detected active burglary syndicate with elevated risk score': 'ಹೆಚ್ಚಿದ ಅಪಾಯದ ಸ್ಕೋರ್ ಹೊಂದಿರುವ ಸಕ್ರಿಯ ಕಳ್ಳತನ ಗ್ಯಾಂಗ್ ಪತ್ತೆಯಾಗಿದೆ.',
    'burglary and fencing syndicate active on city borders with a high-risk score of 95/100': '95/100 ರ ಹೆಚ್ಚಿನ ಅಪಾಯದ ಸ್ಕೋರ್‌ನೊಂದಿಗೆ ನಗರದ ಗಡಿಗಳಲ್ಲಿ ಸಕ್ರಿಯವಾಗಿರುವ ಕಳ್ಳತನ ಮತ್ತು ಕಳವು ಮಾಲು ಮಾರಾಟ ಜಾಲ.',
    'identified cross-jurisdictional links between 3 active theft investigations': '3 ಸಕ್ರಿಯ ಕಳ್ಳತನ ತನಿಖೆಗಳ ನಡುವೆ ಅಂತರ-ವ್ಯಾಪ್ತಿ ಲಿಂಕ್‌ಗಳನ್ನು ಗುರುತಿಸಲಾಗಿದೆ.',
    'cross-jurisdictional correlation shows same modus operandi across majestic and mysuru cases': 'ಅಂತರ-ವ್ಯಾಪ್ತಿಯ ಪರಸ್ಪರ ಸಂಬಂಧವು ಮೆಜೆಸ್ಟಿಕ್ ಮತ್ತು ಮೈಸೂರು ಪ್ರಕರಣಗಳಲ್ಲಿ ಒಂದೇ ರೀತಿಯ ಕಾರ್ಯವಿಧಾನವನ್ನು ತೋರಿಸುತ್ತದೆ.',
    'analyzing available crime intelligence data': 'ಲಭ್ಯವಿರುವ ಅಪರಾಧ ತನಿಖಾ ಡೇಟಾವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ.',
    'analyzing available crime intelligence data in databases no active alert thresholds triggered': 'ಡೇಟಾಬೇಸ್‌ಗಳಲ್ಲಿ ಲಭ್ಯವಿರುವ ಅಪರಾಧ ತನಿಖಾ ಡೇಟಾವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ. ಯಾವುದೇ ಸಕ್ರಿಯ ಎಚ್ಚರಿಕೆ ಮಿತಿಗಳು ಪ್ರಚೋದಿಸಲ್ಪಟ್ಟಿಲ್ಲ.',

    // Reasoning Points
    'linked to 4 bengaluru majestic fir files': '4 ಬೆಂಗಳೂರು ಮೆಜೆಸ್ಟಿಕ್ ಎಫ್‌ಐಆರ್ ಫೈಲ್‌ಗಳಿಗೆ ಲಿಂಕ್ ಮಾಡಲಾಗಿದೆ',
    'appeared in bengaluru hotspot zones (majestic, kr market)': 'ಬೆಂಗಳೂರು ಹಾಟ್‌ಸ್ಪಾಟ್ ವಲಯಗಳಲ್ಲಿ (ಮೆಜೆಸ್ಟಿಕ್, ಕೆಆರ್ ಮಾರ್ಕೆಟ್) ಕಾಣಿಸಿಕೊಂಡಿದ್ದಾರೆ',
    'observed coordinates correlation': 'ನಿರ್ದೇಶಾಂಕಗಳ ಪರಸ್ಪರ ಸಂಬಂಧವನ್ನು ಗಮನಿಸಲಾಗಿದೆ',
    'direct call log matches to offshore hosts': 'ಆಫ್‌ಶೋರ್ ಹೋಸ್ಟ್‌ಗಳಿಗೆ ನೇರ ಕಾಲ್ ಲಾಗ್ ಹೊಂದಾಣಿಕೆಗಳು',
    'wired funds to mule networks': 'ಮ್ಯೂಲ್ ನೆಟ್‌ವರ್ಕ್‌ಗಳಿಗೆ ಹಣ ವರ್ಗಾವಣೆ ಮಾಡಲಾಗಿದೆ',
    'ip matches on spoof admin accounts': 'ನಕಲಿ ಅಡ್ಮಿನ್ ಖಾತೆಗಳಲ್ಲಿ ಐಪಿ ಹೊಂದಾಣಿಕೆಗಳು',
    'spike in credential phishing urls detected': 'ಕ್ರೆಡೆನ್ಶಿಯಲ್ ಫಿಶಿಂಗ್ ಯುಆರ್‌ಎಲ್‌ಗಳಲ್ಲಿ ಭಾರಿ ಹೆಚ್ಚಳ ಪತ್ತೆಯಾಗಿದೆ',
    'proxy servers traced to foreign domains': 'ವಿದೇಶಿ ಡೊಮೇನ್‌ಗಳಿಗೆ ಪ್ರಾಕ್ಸಿ ಸರ್ವರ್‌ಗಳ ಪತ್ತೆ',
    'upi spoof applications identified': 'ಯುಪಿಐ ನಕಲಿ ಅಪ್ಲಿಕೇಶನ್‌ಗಳನ್ನು ಗುರುತಿಸಲಾಗಿದೆ',
    'rapid transit of funds across shell entities': 'ಶೆಲ್ ಘಟಕಗಳ ನಡುವೆ ಹಣದ ತ್ವರಿತ ವರ್ಗಾವಣೆ',
    'amounts structured below reporting limits': 'ವರದಿ ಮಿತಿಗಿಂತ ಕಡಿಮೆ ಮೊತ್ತ ವರ್ಗಾವಣೆ',
    'linked to known financial fraud offenders': 'ತಿಳಿದಿರುವ ಹಣಕಾಸು ವಂಚನೆ ಅಪರಾಧಿಗಳಿಗೆ ಲಿಂಕ್ ಮಾಡಲಾಗಿದೆ',
    'direct links between 7 co-conspirators': '7 ಸಹ-ಸಂಚುಗಾರರ ನಡುವೆ ನೇರ ಸಂಪರ್ಕಗಳು',
    'shared communications logs during crimes': 'ಅಪರಾಧಗಳ ಸಮಯದಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಲಾದ ಸಂವಹನ ದಾಖಲೆಗಳು',
    'fencing operations located on city perimeter': 'ನಗರದ ಗಡಿಯಲ್ಲಿರುವ ಕಳವು ಮಾಲು ಸಂಗ್ರಹ ಕೇಂದ್ರಗಳು',
    'similar lock-breaking tools used': 'ಲಾಕ್ ಒಡೆಯಲು ಬಳಸಿದ ಒಂದೇ ರೀತಿಯ ಉಪಕರಣಗಳು',
    'offender coordinates match transit logs': 'ಅಪರಾಧಿಯ ನಿರ್ದೇಶಾಂಕಗಳು ಸಾರಿಗೆ ದಾಖಲೆಗಳಿಗೆ ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತವೆ',
    'related fence networks observed': 'ಸಂಬಂಧಿತ ಕಳವು ಮಾಲು ಜಾಲಗಳನ್ನು ಗಮನಿಸಲಾಗಿದೆ',
    'no prior conviction match identified': 'ಹಿಂದಿನ ಯಾವುದೇ ಶಿಕ್ಷೆಯ ಹೊಂದಾಣಿಕೆ ಪತ್ತೆಯಾಗಿಲ್ಲ',
    'current location outside identified hotspot areas': 'ಪ್ರಸ್ತುತ ಸ್ಥಳವು ಗುರುತಿಸಲಾದ ಹಾಟ್‌ಸ್ಪಾಟ್ ವಲಯಗಳಿಂದ ಹೊರಗಿದೆ',
    'no direct links to active suspects found': 'ಸಕ್ರಿಯ ಶಂಕಿತರಿಗೆ ಯಾವುದೇ ನೇರ ಸಂಪರ್ಕಗಳು ಪತ್ತೆಯಾಗಿಲ್ಲ',

    // Recommendations
    'audit majestic transit logs': 'ಮೆಜೆಸ್ಟಿಕ್ ಸಾರಿಗೆ ದಾಖಲೆಗಳನ್ನು ಆಡಿಟ್ ಮಾಡಿ',
    'establish night watch at majestic bus stand': 'ಮೆಜೆಸ್ಟಿಕ್ ಬಸ್ ನಿಲ್ದಾಣದಲ್ಲಿ ರಾತ್ರಿ ಕಾವಲುಗಾರರನ್ನು ನಿಯೋಜಿಸಿ',
    'freeze mule bank accounts': 'ಮ್ಯೂಲ್ ಬ್ಯಾಂಕ್ ಖಾತೆಗಳನ್ನು ಸ್ಥಗಿತಗೊಳಿಸಿ',
    'subpoena gateway communication logs': 'ಗೇಟ್‌ವೇ ಸಂವಹನ ದಾಖಲೆಗಳಿಗಾಗಿ ಸಮನ್ಸ್ ಜಾರಿಗೊಳಿಸಿ',
    'subpoena server host logs': 'ಸರ್ವರ್ ಹೋಸ್ಟ್ ದಾಖಲೆಗಳಿಗಾಗಿ ಸಮನ್ಸ್ ಜಾರಿಗೊಳಿಸಿ',
    'notify banking upi gateways': 'ಬ್ಯಾಂಕಿಂಗ್ ಯುಪಿಐ ಗೇಟ್‌ವೇಗಳಿಗೆ ಸೂಚನೆ ನೀಡಿ',
    'request dns takedown of phishing domain': 'ಫಿಶಿಂಗ್ ಡೊಮೇನ್‌ನ ಡಿಎನ್‌ಎಸ್ ರದ್ದತಿಗಾಗಿ ವಿನಂತಿಸಿ',
    'notify financial intelligence unit': 'ಹಣಕಾಸು ತನಿಖಾ ಘಟಕಕ್ಕೆ ಸೂಚನೆ ನೀಡಿ',
    'freeze beneficiary accounts': 'ಫಲಾನುಭವಿ ಖಾತೆಗಳನ್ನು ಸ್ಥಗಿತಗೊಳಿಸಿ',
    'execute simultaneous warrants': 'ಏಕಕಾಲದಲ್ಲಿ ವಾರಂಟ್‌ಗಳನ್ನು ಜಾರಿಗೊಳಿಸಿ',
    'block asset sales channels': 'ಆಸ್ತಿ ಮಾರಾಟದ ಮಾರ್ಗಗಳನ್ನು ನಿರ್ಬಂಧಿಸಿ',
    'audit shared fencing accounts': 'ಹಂಚಿಕೊಳ್ಳಲಾದ ಕಳವು ಮಾಲು ಖಾತೆಗಳನ್ನು ಆಡಿಟ್ ಮಾಡಿ',
    'coordinate across precinct teams': 'ಠಾಣಾ ತಂಡಗಳ ನಡುವೆ ಸಮನ್ವಯ ಸಾಧಿಸಿ',
    'monitor local precinct registries': 'ಸ್ಥಳೀಯ ಠಾಣಾ ರೆಜಿಸ್ಟ್ರಿಗಳನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ',
    'verify identification documents': 'ಗುರುತಿನ ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ',

    // Hotspot Locations & Risks
    'bengaluru majestic': 'ಬೆಂಗಳೂರು ಮೆಜೆಸ್ಟಿಕ್',
    'kr market hub': 'ಕೆಆರ್ ಮಾರ್ಕೆಟ್ ಹಬ್',
    'electronic city tech zone': 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ ಟೆಕ್ ವಲಯ',
    'whitefield hub': 'ವೈಟ್‌ಫೀಲ್ಡ್ ಹಬ್',
    'electronic city': 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ',
    'central business district': 'ಕೇಂದ್ರ ವಾಣಿಜ್ಯ ಜಿಲ್ಲೆ',
    'offshore node traces': 'ಆಫ್‌ಶೋರ್ ನೋಡ್ ಕುರುಹುಗಳು',
    'bengaluru outer ring': 'ಬೆಂಗಳೂರು ಹೊರ ವರ್ತುಲ ರಸ್ತೆ',
    'mysuru highway': 'ಮೈಸೂರು ಹೆದ್ದಾರಿ',
    'mysuru junction': 'ಮೈಸೂರು ಜಂಕ್ಷನ್',
    'hubli junction': 'ಹುಬ್ಬಳ್ಳಿ ಜಂಕ್ಷನ್',
    'high': 'ಹೆಚ್ಚು',
    'medium': 'ಮಧ್ಯಮ',
    'low': 'ಕಡಿಮೆ',

    // Network Node Labels & Relations
    'co-accused ↕': 'ಸಹ-ಆರೋಪಿ ↕',
    'suspect c (phisher)': 'ಶಂಕಿತ ಸಿ (ಫಿಶರ್)',
    'wire transfer ↕': 'ವೈರ್ ವರ್ಗಾವಣೆ ↕',
    'mule account group': 'ಮ್ಯೂಲ್ ಖಾತೆ ಗುಂಪು',
    'call log ↕': 'ಕಾಲ್ ಲಾಗ್ ↕',
    'offshore node x': 'ಆಫ್‌ಶೋರ್ ನೋಡ್ ಎಕ್ಸ್',
    'upi spoof server': 'ಯುಪಿಐ ನಕಲಿ ಸರ್ವರ್',
    'hosted domain ↕': 'ಹೋಸ್ಟ್ ಮಾಡಿದ ಡೊಮೇನ್ ↕',
    'suspect c': 'ಶಂಕಿತ ಸಿ',
    'recruiter ↕': 'ನೇಮಕಾತಿದಾರ ↕',
    'sender account': 'ಕಳುಹಿಸುವವರ ಖಾತೆ',
    'mule account a': 'ಮ್ಯೂಲ್ ಖಾತೆ ಎ',
    'atm cashout ↕': 'ಎಟಿಎಂ ನಗದು ಹಿಂಪಡೆಯುವಿಕೆ ↕',
    'suspect node x': 'ಶಂಕಿತ ನೋಡ್ ಎಕ್ಸ್',
    'suspect a': 'ಶಂಕಿತ ಎ',
    'suspect b': 'ಶಂಕಿತ ಬಿ',
    'asset dump ↕': 'ಆಸ್ತಿ ವಿಲೇವಾರಿ ↕',
    'unknown node': 'ಅಜ್ಞಾತ ನೋಡ್',
    'indirect link ↕': 'ಪರೋಕ್ಷ ಲಿಂಕ್ ↕',
    'query subject': 'ವಿಚಾರಣೆಯ ವಿಷಯ',
    'associate ↕': 'ಸಹವರ್ತಿ ↕',

    // Historical Cases
    'kr market theft case #809': 'ಕೆಆರ್ ಮಾರ್ಕೆಟ್ ಕಳ್ಳತನ ಪ್ರಕರಣ #809',
    'upi phishing scam #101': 'ಯುಪಿಐ ಫಿಶಿಂಗ್ ಹಗರಣ #101',
    'bank spoofing investigation #202': 'ಬ್ಯಾಂಕ್ ನಕಲಿ ತನಿಖೆ #202',
    'upi scam #305': 'ಯುಪಿಐ ಹಗರಣ #305',
    'layering scheme #302': 'ಲೇಯರಿಂಗ್ ಯೋಜನೆ #302',
    'mule network investigation #909': 'ಮ್ಯೂಲ್ ನೆಟ್‌ವರ್ಕ್ ತನಿಖೆ #909',
    'burglary syndicate ring #110': 'ಕಳ್ಳತನ ಜಾಲದ ರಿಂಗ್ #110',
    'mysuru handbag snatching #402': 'ಮೈಸೂರು ಹ್ಯಾಂಡ್‌ಬ್ಯಾಗ್ ಕಳ್ಳತನ #402',
    'general investigation #404': 'ಸಾಮಾನ್ಯ ತನಿಖೆ #404',

    // Action Chips
    'show linked suspects': 'ಸಂಬಂಧಿತ ಶಂಕಿತರನ್ನು ತೋರಿಸಿ',
    'view crime locations': 'ಅಪರಾಧ ಸ್ಥಳಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    'check previous firs': 'ಹಿಂದಿನ ಎಫ್‌ಐಆರ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಿ',
    'generate report': 'ವರದಿ ರಚಿಸಿ',
    'view related cases': 'ಸಂಬಂಧಿತ ಪ್ರಕರಣಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    'analyze risk score': 'ಅಪಾಯದ ಸ್ಕೋರ್ ವಿಶ್ಲೇಷಿಸಿ',
    '✓ show linked suspects': '✓ ಸಂಬಂಧಿತ ಶಂಕಿತರನ್ನು ತೋರಿಸಿ',
    '✓ view crime locations': '✓ ಅಪರಾಧ ಸ್ಥಳಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    '✓ check previous firs': '✓ ಹಿಂದಿನ ಎಫ್‌ಐಆರ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಿ',
    '✓ generate report': '✓ ವರದಿ ರಚಿಸಿ',
    '✓ freeze beneficiary accounts': '✓ ಫಲಾನುಭವಿ ಖಾತೆಗಳನ್ನು ಸ್ಥಗಿತಗೊಳಿಸಿ',
    '✓ view related cases': '✓ ಸಂಬಂಧಿತ ಪ್ರಕರಣಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    '✓ analyze risk score': '✓ ಅಪಾಯದ ಸ್ಕೋರ್ ವಿಶ್ಲೇಷಿಸಿ',

    // Default Hotspot Locations
    'bengaluru urban': 'ಬೆಂಗಳೂರು ನಗರ',
    'mysuru': 'ಮೈಸೂರು',
    'hubli': 'ಹುಬ್ಬಳ್ಳಿ',

    // Timeline Milestone Events
    'fir registered': 'ಎಫ್‌ಐಆರ್ ದಾಖಲಿಸಲಾಗಿದೆ',
    'case recorded in precinct file.': 'ಪ್ರಕರಣವನ್ನು ಪೊಲೀಸ್ ಠಾಣೆಯ ಫೈಲ್‌ನಲ್ಲಿ ದಾಖಲಿಸಲಾಗಿದೆ.',
    'suspect cross-referenced': 'ಶಂಕಿತರ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
    'identified offender records in database.': 'ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಅಪರಾಧಿಯ ದಾಖಲೆಗಳನ್ನು ಗುರುತಿಸಲಾಗಿದೆ.',
    'prior convictions fetched': 'ಹಿಂದಿನ ಶಿಕ್ಷೆಯ ವಿವರಗಳನ್ನು ಪಡೆಯಲಾಗಿದೆ',
    'retrieved 3 historical arrest reports.': '೩ ಹಿಂದಿನ ಬಂಧನ ವರದಿಗಳನ್ನು ಪಡೆಯಲಾಗಿದೆ.',
    'watchlist updated': 'ಕಾವಲು ಪಟ್ಟಿ ನವೀಕರಿಸಲಾಗಿದೆ',
    'placed suspect under active surveillance.': 'ಶಂಕಿತನನ್ನು ಸಕ್ರಿಯ ಕಣ್ಗಾವಲಿನಲ್ಲಿ ಇಡಲಾಗಿದೆ.',
    'credential harvesting alert': 'ರುಜುವಾತು ಕಳ್ಳತನದ ಎಚ್ಚರಿಕೆ',
    'victim reported credential phishing site.': 'ಬಲಿಪಶುವು ರುಜುವಾತು ಫಿಶಿಂಗ್ ಸೈಟ್ ಬಗ್ಗೆ ವರದಿ ಮಾಡಿದ್ದಾರೆ.',
    'ip addresses decrypted': 'ಐಪಿ ವಿಳಾಸಗಳನ್ನು ಡೀಕ್ರिಪ್ಟ್ ಮಾಡಲಾಗಿದೆ',
    'traced proxy originating headers.': 'ಪ್ರಾಕ್ಸಿ ಮೂಲ ಹೆಡರ್‌ಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಲಾಗಿದೆ.',
    'accounts flagged': 'ಖಾತೆಗಳನ್ನು ಗುರುತಿಸಲಾಗಿದೆ',
    'flagged 5 target transaction accounts.': '೫ ಉದ್ದೇಶಿತ ವಹಿವಾಟು ಖಾತೆಗಳನ್ನು ಗುರುತಿಸಲಾಗಿದೆ.',
    'assets frozen': 'ಆಸ್ತಿಗಳನ್ನು ಮುಟ್ಟುಗೋಲು ಹಾಕಿಕೊಳ್ಳಲಾಗಿದೆ',
    'secured court warrant to hold target assets.': 'ಉದ್ದೇಶಿತ ಆಸ್ತಿಗಳನ್ನು ತಡೆಹಿಡಿಯಲು ನ್ಯಾಯಾಲಯದ ವಾರಂಟ್ ಪಡೆಯಲಾಗಿದೆ.',
    'syndicate profile created': 'ಕೂಟದ ಪ್ರೊಫೈಲ್ ರಚಿಸಲಾಗಿದೆ',
    'linked suspect phone exchanges mapped.': 'ಸಂಪರ್ಕಿತ ಶಂಕಿತರ ಫೋನ್ ಸಂಭಾಷಣೆಗಳನ್ನು ಮ್ಯಾಪ್ ಮಾಡಲಾಗಿದೆ.',
    'log subpoenas served': 'ದಾಖಲೆಗಳ ಸಮ್ಮನ್ ಜಾರಿಗೊಳಿಸಲಾಗಿದೆ',
    'call data records subpoenaed for 7 nodes.': '೭ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಗಳ ಕರೆ ದಾಖಲೆಗಳ ಸಮ್ಮನ್ ಪಡೆಯಲಾಗಿದೆ.',
    'syndicate tree plotted': 'ಕೂಟದ ನಕ್ಷೆಯನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗಿದೆ',
    'linked suspect map registered in case file.': 'ಸಂಪರ್ಕಿತ ಶಂಕಿತರ ನಕ್ಷೆಯನ್ನು ಪ್ರಕರಣದ ಫೈಲ್‌ನಲ್ಲಿ ನೋಂದಾಯಿಸಲಾಗಿದೆ.',
    'warrants issued': 'ವಾರಂಟ್‌ಗಳನ್ನು ಹೊರಡಿಸಲಾಗಿದೆ',
    'magistrate signed search and capture warrants.': 'ಮ್ಯಾಜಿಸ್ಟ್ರೇಟ್ ಅವರು ಶೋಧ ಮತ್ತು ಬಂಧನ ವಾರಂಟ್‌ಗಳಿಗೆ ಸಹಿ ಹಾಕಿದ್ದಾರೆ.',
    'clustered rates logged': 'ಕ್ಲಸ್ಟರ್ ದರಗಳನ್ನು ದಾಖಲಿಸಲಾಗಿದೆ',
    'incident rates tracked in majestic bus stand.': 'ಮೆಜೆಸ್ಟಿಕ್ ಬಸ್ ನಿಲ್ದಾಣದಲ್ಲಿ ಘಟನೆಗಳ ದರಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಲಾಗಿದೆ.',
    'patrol dispatch alert': 'ಪಹರೆ ಕಳುಹಿಸುವ ಎಚ್ಚರಿಕೆ',
    'increased tactical sweeps dispatched to target areas.': 'ಉದ್ದೇಶಿತ ಪ್ರದೇಶಗಳಿಗೆ ಹೆಚ್ಚಿನ ಪೊಲೀಸ್ ಪಹರೆಯನ್ನು ನಿಯೋಜಿಸಲಾಗಿದೆ.',
    'hotspots model updated': 'ಹೋಟ್‌ಸ್ಪಾಟ್ ಮಾದರಿಯನ್ನು ನವೀಕರಿಸಲಾಗಿದೆ',
    'patrol map routes recalculated.': 'ಪಹರೆ ಮಾರ್ગಗಳನ್ನು ಮರು-ಲೆಕ್ಕಾಚಾರ ಮಾಡಲಾಗಿದೆ.',
    'crime rates reduced': 'ಅಪರಾಧದ ದರಗಳು ಕಡಿಮೆಯಾಗಿವೆ',
    'local precinct reported 30% reduction in local thefts.': 'ಸ್ಥಾನಿಕ ಠಾಣೆಯು ಸ್ಥಳೀಯ ಕಳ್ಳತನದಲ್ಲಿ ೩೦% ಇಳಿಕೆಯನ್ನು ವರದಿ ಮಾಡಿದೆ।'
  },

  // Tamil Mappings
  ta: {
    // Query Mappings
    'show repeat offenders': 'மீண்டும் குற்றம் செய்பவர்களை காட்டு',
    'show repeat offenders in bengaluru': 'பெங்களூரில் மீண்டும் குற்றம் செய்பவர்களை காட்டு',
    'only in bengaluru': 'பெங்களூரில் மட்டும்',
    'only in mysuru': 'மைசூரில் மட்டும்',
    'show crime hotspots': 'குற்றப் பகுதிகளைக் காட்டு',
    'show cybercrime cases': 'சைபர் குற்ற வழக்குகளைக் காட்டு',
    'show financial fraud suspects': 'நிதி மோசடி சந்தேக நபர்களைக் காட்டு',
    'show high risk offenders': 'அதிக ஆபத்துள்ள குற்றவாளிகளைக் காட்டு',
    'find linked cases': 'தொடர்புடைய வழக்குகளைக் கண்டுபிடி',
    'find suspects connected to cyber fraud': 'சைபர் மோசடியுடன் தொடர்புடைய சந்தேக நபர்களைக் கண்டுபிடி',

    // Verbal Replies & Summaries
    'found 2 repeat offenders active in bengaluru: kiran kumar and rajesh sekhar': 'பெங்களூரில் 2 மீண்டும் குற்றம் செய்பவர்கள் கண்டறியப்பட்டனர்: கிரண் குமார் மற்றும் ராஜேஷ் சேகர்.',
    'filtered 2 repeat offenders linked to bengaluru majestic transit logs and local precincts': 'பெங்களூரு மெஜஸ்டிக் போக்குவரத்து பதிவுகள் மற்றும் உள்ளூர் காவல் நிலையங்களுடன் தொடர்புடைய 2 மீண்டும் குற்றம் செய்பவர்கள் வடிகட்டப்பட்டனர்.',
    'found 3 suspects connected to cyber fraud ring': 'சைபர் மோசடி கும்பலுடன் தொடர்புடைய 3 சந்தேக நபர்கள் கண்டறியப்பட்டனர்.',
    'suspect network analysis shows coordination on upi spoofing and mule bank accounts': 'சந்தேக நபர் நெட்வொர்க் பகுப்பாய்வு யுபிஐ ஏமாற்றுதல் மற்றும் மியூல் வங்கி கணக்குகளில் ஒருங்கிணைப்பைக் காட்டுகிறது.',
    'cybercrime complaints increased by 18% this month, primarily upi phishing': 'இந்த महिन्यात சைபர் குற்ற புகார்கள் 18% அதிகரித்துள்ளன, முக்கியமாக யுபிஐ ஃபிஷிங்.',
    'cybercrime complaints increased by 18% this month, primarily upi phishing and credentials harvesting': 'இந்த महिन्यात சைபர் குற்ற புகார்கள் 18% அதிகரித்துள்ளன, முக்கியமாக யுபிஐ ஃபிஷிங் மற்றும் கிரிடென்ஷியல் திருட்டு.',
    'suspicious transactions identified across 5 accounts linked to suspect nodes': 'சந்தேக நபர் கணக்குகளுடன் தொடர்புடைய 5 கணக்குகளில் சந்தேகத்திற்குரிய பரிவர்த்தனைகள் கண்டறியப்பட்டன.',
    'suspicious transactions identified across 5 bank accounts representing layered shell entities': 'அடுக்கு ஷெல் நிறுவனங்களைக் குறிக்கும் 5 வங்கி கணக்குகளில் சந்தேகத்திற்குரிய பரிவர்த்தனைகள் கண்டறியப்பட்டன.',
    'detected active burglary syndicate with elevated risk score': 'அதிகரித்த ஆபத்து புள்ளிகளுடன் செயலில் உள்ள கொள்ளை கும்பல் கண்டறியப்பட்டது.',
    'burglary and fencing syndicate active on city borders with a high-risk score of 95/100': '95/100 என்ற அதிக ஆபத்து புள்ளிகளுடன் நகர எல்லைகளில் கொள்ளை மற்றும் திருட்டுப் பொருள் விற்பனை கும்பல் செயலில் உள்ளது.',
    'identified cross-jurisdictional links between 3 active theft investigations': '3 செயலில் உள்ள திருட்டு புலனாய்வுகளுக்கு இடையே எல்லை கடந்த தொடர்புகள் கண்டறியப்பட்டன.',
    'cross-jurisdictional correlation shows same modus operandi across majestic and mysuru cases': 'எல்லை கடந்த ஒப்பீடு மெஜஸ்டிக் மற்றும் மைசூர் வழக்குகளில் ஒரே மாதிரியான குற்ற முறையைக் காட்டுகிறது.',
    'analyzing available crime intelligence data': 'கிடைக்கக்கூடிய குற்ற புலனாய்வு தரவு பகுப்பாய்வு செய்யப்படுகிறது.',
    'analyzing available crime intelligence data in databases no active alert thresholds triggered': 'தரவுத்தளங்களில் கிடைக்கக்கூடிய குற்ற புலனாய்வு தரவு பகுப்பாய்வு செய்யப்படுகிறது. செயலில் உள்ள எச்சரிக்கை வரம்புகள் எதுவும் தூண்டப்படவில்லை.',

    // Reasoning Points
    'linked to 4 bengaluru majestic fir files': '4 பெங்களூரு மெஜஸ்டிக் முதல் தகவல் அறிக்கை (FIR) கோப்புகளுடன் தொடர்புடையது',
    'appeared in bengaluru hotspot zones (majestic, kr market)': 'பெங்களூரு ஹாட்ஸ்பாட் பகுதிகளில் (மெஜஸ்டிக், கேஆர் மார்க்கெட்) காணப்பட்டார்',
    'observed coordinates correlation': 'இருப்பிட ஒருங்கிணைப்பு ஒப்பீடு கண்டறியப்பட்டது',
    'direct call log matches to offshore hosts': 'வெளிநாட்டு ஹோஸ்ட்களுடன் நேரடி அழைப்பு பதிவு பொருத்தம்',
    'wired funds to mule networks': 'மியூல் நெட்வொர்க்குகளுக்கு நிதி மாற்றப்பட்டது',
    'ip matches on spoof admin accounts': 'ஏமாற்று நிர்வாக கணக்குகளில் IP முகவரி பொருத்தம்',
    'spike in credential phishing urls detected': 'கிரிடென்ஷியல் ஃபிஷிங் முகவரிகளில் பெரும் அதிகரிப்பு கண்டறியப்பட்டது',
    'proxy servers traced to foreign domains': 'வெளிநாட்டு டொமைன்களுடன் தொடர்புடைய பிராக்ஸி சர்வர்கள் கண்டறியப்பட்டன',
    'upi spoof applications identified': 'யுபிஐ ஏமாற்று செயலிகள் கண்டறியப்பட்டன',
    'rapid transit of funds across shell entities': 'ஷெல் நிறுவனங்களுக்கு இடையே விரைவான நிதி பரிமாற்றம்',
    'amounts structured below reporting limits': 'அறிக்கை வரம்புகளுக்கு கீழே உள்ளவாறு பிரிக்கப்பட்ட நிதியளவுகள்',
    'linked to known financial fraud offenders': 'அறியப்பட்ட நிதி மோசடி குற்றவாளிகளுடன் தொடர்புடையது',
    'direct links between 7 co-conspirators': '7 கூட்டு சதிகாரர்களுக்கு இடையே நேரடி தொடர்புகள்',
    'shared communications logs during crimes': 'குற்றங்களின் போது பகிரப்பட்ட தகவல் தொடர்பு பதிவுகள்',
    'fencing operations located on city perimeter': 'நகர எல்லையில் உள்ள திருட்டுப் பொருள் மறைவிடங்கள்',
    'similar lock-breaking tools used': 'பூட்டை உடைக்க ஒரே மாதிரியான கருவிகள் பயன்படுத்தப்பட்டது',
    'offender coordinates match transit logs': 'குற்றவாளியின் இருப்பிடங்கள் போக்குவரத்து பதிவுகளுடன் பொருந்துகின்றன',
    'related fence networks observed': 'தொடர்புடைய திருட்டுப் பொருள் விற்பனை நெட்வொர்க்குகள் கண்டறியப்பட்டன',
    'no prior conviction match identified': 'முந்தைய குற்றப்பதிவுகள் எதுவும் கண்டறியப்படவில்லை',
    'current location outside identified hotspot areas': 'தற்போதைய இருப்பிடம் கண்டறியப்பட்ட ஹாட்ஸ்பாட் பகுதிகளுக்கு வெளியே உள்ளது',
    'no direct links to active suspects found': 'செயலில் உள்ள சந்தேக நபர்களுடன் நேரடி தொடர்புகள் எதுவும் கண்டறியப்படவில்லை',

    // Recommendations
    'audit majestic transit logs': 'மெஜஸ்டிக் போக்குவரத்து பதிவுகளை தணிக்கை செய்க',
    'establish night watch at majestic bus stand': 'மெஜஸ்டிக் பேருந்து நிலையத்தில் இரவு நேர கண்காணிப்பை நிறுவுக',
    'freeze mule bank accounts': 'மியூல் வங்கி கணக்குகளை முடக்குக',
    'subpoena gateway communication logs': 'கேட்வே தகவல் தொடர்பு பதிவுகளை சம்மன் செய்க',
    'subpoena server host logs': 'சர்வர் ஹோஸ்ட் பதிவுகளை சம்மன் செய்க',
    'notify banking upi gateways': 'வங்கி யுபிஐ கேட்வேகளுக்கு அறிவிப்பு செய்க',
    'request dns takedown of phishing domain': 'ஃபிஷிங் டொமைனின் டிஎன்எஸ் முடக்கத்திற்கு கோரிக்கை விடுக்க',
    'notify financial intelligence unit': 'நிதி புலனாய்வு பிரிவுக்கு அறிவிப்பு செய்க',
    'freeze beneficiary accounts': 'பயனாளி கணக்குகளை முடக்குக',
    'execute simultaneous warrants': 'ஒரே நேரத்தில் வாரண்டுகளை செயல்படுத்துக',
    'block asset sales channels': 'சொத்து விற்பனை வழிகளை முடக்குக',
    'audit shared fencing accounts': 'பகிரப்பட்ட திருட்டுப் பொருள் விற்பனை கணக்குகளை தணிக்கை செய்க',
    'coordinate across precinct teams': 'காவல் எல்லை குழுக்களுக்கு இடையே ஒருங்கிணைப்பு செய்க',
    'monitor local precinct registries': 'உள்ளூர் காவல் நிலைய பதிவேடுகளை கண்காணிக்க',
    'verify identification documents': 'அடையாள ஆவணங்களை சரிபார்க்க',

    // Hotspot Locations & Risks
    'bengaluru majestic': 'பெங்களூரு மெஜஸ்டிக்',
    'kr market hub': 'கேஆர் மார்க்கெட் மையம்',
    'electronic city tech zone': 'எலக்ட்ரானிக் சிட்டி தொழில்நுட்ப பகுதி',
    'whitefield hub': 'வைட்ஃபீல்ட் மையம்',
    'electronic city': 'எலக்ட்ரானிக் சிட்டி',
    'central business district': 'மத்திய வணிக பகுதி',
    'offshore node traces': 'வெளிநாட்டு முனைய தடயங்கள்',
    'bengaluru outer ring': 'பெங்களூரு வெளிவட்ட சாலை',
    'mysuru highway': 'மைசூர் நெடுஞ்சாலை',
    'mysuru junction': 'மைசூர் சந்திப்பு',
    'hubli junction': 'ஹூப்ளி சந்திப்பு',
    'high': 'உயர்',
    'medium': 'நடுத்தர',
    'low': 'குறைந்த',

    // Network Node Labels & Relations
    'co-accused ↕': 'கூட்டு குற்றவாளி ↕',
    'suspect c (phisher)': 'சந்தேக நபர் சி (ஃபிஷர்)',
    'wire transfer ↕': 'வங்கி பரிமாற்றம் ↕',
    'mule account group': 'மியூல் கணக்கு குழு',
    'call log ↕': 'அழைப்பு பதிவு ↕',
    'offshore node x': 'வெளிநாட்டு முனையம் எக்ஸ்',
    'upi spoof server': 'யுபிஐ ஏமாற்று சர்வர்',
    'hosted domain ↕': 'ஹோஸ்ட் செய்யப்பட்ட டொமைன் ↕',
    'suspect c': 'சந்தேக நபர் சி',
    'recruiter ↕': 'ஆள் சேர்ப்பவர் ↕',
    'sender account': 'அனுப்புநர் கணக்கு',
    'mule account a': 'மியூல் கணக்கு ஏ',
    'atm cashout ↕': 'ஏடிஎம் பணம் எடுத்தல் ↕',
    'suspect node x': 'சந்தேக நபர் முனையம் எக்ஸ்',
    'suspect a': 'சந்தேக நபர் ஏ',
    'suspect b': 'சந்தேக நபர் பி',
    'asset dump ↕': 'சொத்து விற்பனை ↕',
    'unknown node': 'அறியப்படாத முனையம்',
    'indirect link ↕': 'மறைமுக தொடர்பு ↕',
    'query subject': 'விசாரணை பொருள்',
    'associate ↕': 'கூட்டாளி ↕',

    // Historical Cases
    'kr market theft case #809': 'கேஆர் மார்க்கெட் திருட்டு வழக்கு #809',
    'upi phishing scam #101': 'யுபிஐ ஃபிஷிங் மோசடி #101',
    'bank spoofing investigation #202': 'வங்கி ஏமாற்று புலனாய்வு #202',
    'upi scam #305': 'யுபிஐ மோசடி #305',
    'layering scheme #302': 'லேயரிங் திட்டம் #302',
    'mule network investigation #909': 'மியூல் நெட்வொர்க் புலனாய்வு #909',
    'burglary syndicate ring #110': 'கொள்ளை கும்பல் வளையம் #110',
    'mysuru handbag snatching #402': 'மைசூர் கைப்பைக் கொள்ளை #402',
    'general investigation #404': 'பொது புலனாய்வு #404',

    // Action Chips
    'show linked suspects': 'தொடர்புடைய சந்தேக நபர்களைக் காட்டு',
    'view crime locations': 'குற்றப் பகுதிகளைப் பார்',
    'check previous firs': 'முந்தைய முதல் தகவல் அறிக்கைகளை சரிபார்',
    'generate report': 'அறிக்கை உருவாக்கு',
    'view related cases': 'தொடர்புடைய வழக்குகளைப் பார்',
    'analyze risk score': 'ஆபத்து நிலையை ஆய்வு செய்',
    '✓ show linked suspects': '✓ தொடர்புடைய சந்தேக நபர்களைக் காட்டு',
    '✓ view crime locations': '✓ குற்றப் பகுதிகளைப் பார்',
    '✓ check previous firs': '✓ முந்தைய முதல் தகவல் அறிக்கைகளை சரிபார்',
    '✓ generate report': '✓ அறிக்கை உருவாக்கு',
    '✓ freeze beneficiary accounts': '✓ பயனாளி கணக்குகளை முடக்கு',
    '✓ view related cases': '✓ தொடர்புடைய வழக்குகளைப் பார்',
    '✓ analyze risk score': '✓ ஆபத்து நிலையை ஆய்வு செய்',

    // Default Hotspot Locations
    'bengaluru urban': 'பெங்களூரு நகர்ப்புறம்',
    'mysuru': 'மைசூர்',
    'hubli': 'ஹூப்ளி',

    // Timeline Milestone Events
    'fir registered': 'முதல் தகவல் அறிக்கை (FIR) பதிவு செய்யப்பட்டது',
    'case recorded in precinct file.': 'வழக்கு காவல் நிலைய கோப்பில் பதிவு செய்யப்பட்டது.',
    'suspect cross-referenced': 'சந்தேக நபர் குறுக்கு விசாரணை செய்யப்பட்டார்',
    'identified offender records in database.': 'தரவுத்தளத்தில் குற்றவாளியின் பதிவுகள் அடையாளம் காணப்பட்டன.',
    'prior convictions fetched': 'முந்தைய தண்டனை விவரங்கள் பெறப்பட்டன',
    'retrieved 3 historical arrest reports.': '3 முந்தைய கைது அறிக்கைகள் பெறப்பட்டன.',
    'watchlist updated': 'கண்காணிப்பு பட்டியல் புதுப்பிக்கப்பட்டது', // Wait, 'Watchlist Updated' is 'கண்காணிப்பு பட்டியல் புதுப்பிக்கப்பட்டது'
    'placed suspect under active surveillance.': 'சந்தேக நபர் தீவிர கண்காணிப்பில் வைக்கப்பட்டார்.',
    'credential harvesting alert': 'அடையாளச் சான்று திருட்டு எச்சரிக்கை',
    'victim reported credential phishing site.': 'பாதிக்கப்பட்டவர் அடையாளச் சான்று ஃபிஷிங் தளத்தைப் புகாரளித்தார்.',
    'ip addresses decrypted': 'ஐபி முகவரிகள் டிக்ரிப்ட் செய்யப்பட்டன',
    'traced proxy originating headers.': 'பிராக்சி மூல தலைப்புகள் கண்டறியப்பட்டன.',
    'accounts flagged': 'கணக்குகள் குறிக்கப்பட்டன',
    'flagged 5 target transaction accounts.': '5 இலக்கு பரிவர்த்தனை கணக்குகள் குறிக்கப்பட்டன.',
    'assets frozen': 'சொத்துக்கள் முடக்கப்பட்டன',
    'secured court warrant to hold target assets.': 'இலக்கு சொத்துக்களை முடக்க நீதிமன்ற வாரண்ட் பெறப்பட்டது.',
    'syndicate profile created': 'கும்பல் சுயவிவரம் உருவாக்கப்பட்டது',
    'linked suspect phone exchanges mapped.': 'தொடர்புடைய சந்தேக நபர்களின் தொலைபேசி அழைப்புகள் வரைபடமாக்கப்பட்டன.',
    'log subpoenas served': 'பதிவு அழைப்பாணைகள் அனுப்பப்பட்டன',
    'call data records subpoenaed for 7 nodes.': '7 முனைகளுக்கான அழைப்பு தரவு பதிவுகளுக்கு அழைப்பாணை அனுப்பப்பட்டது.',
    'syndicate tree plotted': 'கும்பல் வரைபடம் வரையப்பட்டது',
    'linked suspect map registered in case file.': 'தொடர்புடைய சந்தேக நபர்களின் வரைபடம் வழக்கு கோப்பில் பதிவு செய்யப்பட்டது.',
    'warrants issued': 'வாரண்டுகள் பிறப்பிக்கப்பட்டன',
    'magistrate signed search and capture warrants.': 'மஜிஸ்திரேட் தேடுதல் மற்றும் கைது வாரண்டுகளில் கையெழுத்திட்டார்.',
    'clustered rates logged': 'குவிந்த குற்ற விகிதங்கள் பதிவு செய்யப்பட்டன',
    'incident rates tracked in majestic bus stand.': 'மெஜஸ்டிக் பேருந்து நிலையத்தில் குற்றச் சம்பவங்கள் கண்காணிக்கப்பட்டன.',
    'patrol dispatch alert': 'ரோந்து வாகன எச்சரிக்கை',
    'increased tactical sweeps dispatched to target areas.': 'இலக்கு பகுதிகளுக்கு தீவிர ரோந்து வாகனங்கள் அனுப்பப்பட்டன.',
    'hotspots model updated': 'குற்றப் பகுதி மாதிரி புதுப்பிக்கப்பட்டது',
    'patrol map routes recalculated.': 'ரோந்து வழித்தடங்கள் மறுமதிப்பீடு செய்யப்பட்டன.',
    'crime rates reduced': 'குற்ற விகிதங்கள் குறைந்தன',
    'local precinct reported 30% reduction in local thefts.': 'உள்ளூர் காவல் நிலையம் உள்ளூர் திருட்டுகளில் 30% குறைவை அறிவித்தது.'
  },

  // Telugu Mappings
  te: {
    // Query Mappings
    'show repeat offenders': 'పాత నేరస్థులను చూపించు',
    'show repeat offenders in bengaluru': 'బెంగళూరులో పాత నేరస్థులను చూపించు',
    'only in bengaluru': 'బెంగళూరులో మాత్రమే',
    'only in mysuru': 'మైసూర్ లో మాత్రమే',
    'show crime hotspots': 'నేరాల హాట్‌స్పాట్‌లను చూపించు',
    'show cybercrime cases': 'సైబర్ నేరాల కేసులను చూపించు',
    'show financial fraud suspects': 'ఆర్థిక వంచన అనుమానితులను చూపించు',
    'show high risk offenders': 'ఎక్కువ ప్రమాదకరమైన నేరస్థులను చూపించు',
    'find linked cases': 'లింక్ చేయబడిన కేసులను కనుగొను',
    'find suspects connected to cyber fraud': 'సైబర్ వంచనతో సంబంధం ఉన్న అనుమానితులను కనుగొను',

    // Verbal Replies & Summaries
    'found 2 repeat offenders active in bengaluru: kiran kumar and rajesh sekhar': 'బెంగళూరులో యాక్టివ్‌గా ఉన్న 2 పాత నేరస్థులు కనుగొనబడ్డారు: కిరణ్ కుమార్ మరియు రాజేష్ శేఖర్.',
    'filtered 2 repeat offenders linked to bengaluru majestic transit logs and local precincts': 'బెంగళూరు మెజెస్టిక్ రవాణా లాగ్‌లు మరియు స్థానిక పోలీస్ స్టేషన్‌లకు లింక్ చేయబడిన 2 పాత నేరస్థులు ఫిల్టర్ చేయబడ్డారు.',
    'found 3 suspects connected to cyber fraud ring': 'సైబర్ వంచన ముఠాతో సంబంధం ఉన్న 3 అనుమానితులు కనుగొనబడ్డారు.',
    'suspect network analysis shows coordination on upi spoofing and mule bank accounts': 'అనుమానితుల నెట్‌వర్క్ విశ్లేషణ UPI స్పూఫింగ్ మరియు మ్యూల్ బ్యాంక్ ఖాతాలపై సమన్వయాన్ని చూపుతుంది.',
    'cybercrime complaints increased by 18% this month, primarily upi phishing': 'ఈ నెలలో సైబర్ నేరాల ఫిర్యాదులు 18% పెరిగాయి, ప్రధానంగా UPI ఫిషింగ్.',
    'cybercrime complaints increased by 18% this month, primarily upi phishing and credentials harvesting': 'ఈ నెలలో సైబర్ నేరాల ఫిర్యాదులు 18% పెరిగాయి, ప్రధానంగా UPI ఫిషింగ్ మరియు క్రెడెన్షియల్స్ హార్వెస్టింగ్.',
    'suspicious transactions identified across 5 accounts linked to suspect nodes': 'అనుమానిత నోడ్‌లకు లింక్ చేయబడిన 5 ఖాతాలలో అనుమానాస్పద లావాదేవీలు గుర్తించబడ్డాయి.',
    'suspicious transactions identified across 5 bank accounts representing layered shell entities': 'లేయర్డ్ షెల్ సంస్థలను సూచించే 5 బ్యాంక్ ఖాతాలలో అనుమానాస్పద లావాదేవీలు గుర్తించబడ్డాయి.',
    'detected active burglary syndicate with elevated risk score': 'ఎక్కువ ప్రమాద స్కోరుతో యాక్టివ్‌గా ఉన్న దొంగతనాల ముఠా కనుగొనబడింది.',
    'burglary and fencing syndicate active on city borders with a high-risk score of 95/100': '95/100 ఎక్కువ ప్రమాద స్కోరుతో నగర సరిహద్దుల్లో దొంగతనాలు మరియు చోరీ సొత్తు విక్రయాల ముఠా యాక్టివ్‌గా ఉంది.',
    'identified cross-jurisdictional links between 3 active theft investigations': '3 యాక్టివ్ దొంగతనం విచారణల మధ్య అంతర్-పరిధి లింకులు గుర్తించబడ్డాయి.',
    'cross-jurisdictional correlation shows same modus operandi across majestic and mysuru cases': 'అంతర్-పరిధి సహసంబంధం మెజెస్టిక్ మరియు మైసూర్ కేసులలో ఒకే రకమైన నేర విధానాన్ని చూపుతుంది.',
    'analyzing available crime intelligence data': 'లభ్యతలో ఉన్న నేర సమాచారాన్ని విсел్యేషిస్తోంది.',
    'analyzing available crime intelligence data in databases no active alert thresholds triggered': 'డేటాబేస్‌లలో అందుబాటులో ఉన్న నేర సమాచారాన్ని విశ్లేషిస్తోంది. ఎలాంటి యాక్టివ్ అలర్ట్ పరిమితులు ప్రేరేపించబడలేదు.',

    // Reasoning Points
    'linked to 4 bengaluru majestic fir files': '4 బెంగళూరు మెజెస్టిక్ FIR ఫైల్‌లకు లింక్ చేయబడింది',
    'appeared in bengaluru hotspot zones (majestic, kr market)': 'బెంగళూరు హాట్‌స్పాట్ ప్రాంతాలలో (మెజెస్టిక్, KR మార్కెట్) కనిపించారు',
    'observed coordinates correlation': 'निర్దేశాంకాల సహసంబంధం గమనించబడింది',
    'direct call log matches to offshore hosts': 'విదేశీ హోస్ట్‌లతో ప్రత్యక్ష కాల్ లాగ్ మ్యాచ్‌లు',
    'wired funds to mule networks': 'మ్యూల్ నెట్‌వర్క్‌లకు నిధులు బదిలీ చేయబడ్డాయి',
    'ip matches on spoof admin accounts': 'స్పూఫ్ అడ్మిన్ ఖాతాలపై IP మ్యాచ్‌లు',
    'spike in credential phishing urls detected': 'క్రెడెన్షియల్ ఫిషింగ్ URLలలో పెరుగుదల గుర్తించబడింది',
    'proxy servers traced to foreign domains': 'విదేశీ డొమైన్‌లకు ప్రాక్సీ సర్వర్ల గుర్తింపు',
    'upi spoof applications identified': 'UPI స్పూఫ్ అప్లికేషన్లు గుర్తించబడ్డాయి',
    'rapid transit of funds across shell entities': 'शेल సంస్థల మధ్య నిధుల వేగవంతమైన బదిలీ',
    'amounts structured below reporting limits': 'రిపోర్టింగ్ పరిమితుల కంటే తక్కువగా ఉన్న మొత్తాలు',
    'linked to known financial fraud offenders': 'తెలిసిన ఆర్థిక వంచన నేరస్థులతో లింక్ చేయబడింది',
    'direct links between 7 co-conspirators': '7 మంది సహ-నేరస్థుల మధ్య ప్రత్యక్ష లింకులు',
    'shared communications logs during crimes': 'నేరాల సమయంలో షేర్ చేయబడిన కమ్యూనికేషన్స్ లాగ్‌లు',
    'fencing operations located on city perimeter': 'నగర శివార్లలో ఉన్న చోరీ సొత్తు విక్రయ కేంద్రాలు',
    'similar lock-breaking tools used': 'తాళాలు పగలగొట్టడానికి ఒకే రకమైన పరికరాలు ఉపయోగించబడ్డాయి',
    'offender coordinates match transit logs': 'నేరస్థుడి నిర్దేశాంకాలు రవాణా లాగ్‌లతో సరిపోలుతున్నాయి',
    'related fence networks observed': 'సంబంధిత చోరీ సొత్తు విక్రయ నెట్‌వర్క్‌లు గమనించబడ్డాయి',
    'no prior conviction match identified': 'గతంలో ఎలాంటి నేర చరిత్ర మ్యాచ్‌లు గుర్తించబడలేదు',
    'current location outside identified hotspot areas': 'ప్రస్తుత ప్రాంతం గుర్తించబడిన హాట్‌స్పాట్ ప్రాంతాల వెలుపల ఉంది',
    'no direct links to active suspects found': 'యాక్టివ్ అనుమానితులతో ప్రత్యక్ష లింకులు ఏవీ కనుగొనబడలేదు',

    // Recommendations
    'audit majestic transit logs': 'మెజెస్టిక్ రవాణా లాగ్‌లను ఆడిట్ చేయండి',
    'establish night watch at majestic bus stand': 'మెజెస్టిక్ బస్ స్టాండ్ వద్ద నైట్ వాచ్ ఏర్పాటు చేయండి',
    'freeze mule bank accounts': 'మ్యూల్ బ్యాంక్ ఖాతాలను ఫ్రీజ్ చేయండి',
    'subpoena gateway communication logs': 'గేట్‌വേ కమ్యూనికేషన్ లాగ్‌లను సమన్లు చేయండి',
    'subpoena server host logs': 'సర్వర్ హోస్ట్ లాగ్‌లను సమన్లు చేయండి',
    'notify banking upi gateways': 'బ్యాంకింగ్ UPI గేట్‌వేలకు తెలియజేయండి',
    'request dns takedown of phishing domain': 'ఫిషింగ్ డొమైన్ యొక్క DNS టేక్‌డౌన్‌ను అభ్యర్థించండి',
    'notify financial intelligence unit': 'ఆర్థిక నిఘా విభాగానికి తెలియజేయండి',
    'freeze beneficiary accounts': 'లబ్ధిదారుల ఖాతాలను ఫ్రీజ్ చేయండి',
    'execute simultaneous warrants': 'ఒకేసారి వారెంట్లు జారీ చేయండి',
    'block asset sales channels': 'ఆస్తుల విక్రయ మార్గాలను బ్లాక్ చేయండి',
    'audit shared fencing accounts': 'భాగస్వామ్య చోరీ సొత్తు ఖాతాలను ఆడిట్ చేయండి',
    'coordinate across precinct teams': 'పోలీస్ స్టేషన్ బృందాల మధ్య సమన్వయం చేయండి',
    'monitor local precinct registries': 'స్థానిక పోలీస్ స్టేషన్ రిజిస్ట్రీలను పర్యవేక్షించండి',
    'verify identification documents': 'గుర్తింపు పత్రాలను ధృవీకరించండి',

    // Hotspot Locations & Risks
    'bengaluru majestic': 'బెంగళూరు మెజెస్టిక్',
    'kr market hub': 'KR మార్కెట్ హబ్',
    'electronic city tech zone': 'ఎలక్ట్రానిక్ సిటీ టెక్ జోన్',
    'whitefield hub': 'వైట్‌ఫీల్డ్ హబ్',
    'electronic city': 'ఎలక్ట్రానిక్ సిటీ',
    'central business district': 'సెంట్రల్ బిజినెస్ డిస్ట్రిక్ట్',
    'offshore node traces': 'విదేశీ నోడ్ జాడలు',
    'bengaluru outer ring': 'బెంగళూరు ఔటర్ రింగ్',
    'mysuru highway': 'మైసూర్ హైవే',
    'mysuru junction': 'మైసూర్ జంక్షన్',
    'hubli junction': 'హుబ్లీ జంక్షన్',
    'high': 'ఎక్కువ',
    'medium': 'مధ్యస్థం',
    'low': 'తక్కువ',

    // Network Node Labels & Relations
    'co-accused ↕': 'సహ-నిందితుడు ↕',
    'suspect c (phisher)': 'అనుమానితుడు C (ఫిషర్)',
    'wire transfer ↕': 'వైర్ బదిలీ ↕',
    'mule account group': 'మ్యూల్ ఖాతా సమూహం',
    'call log ↕': 'కాల్ లాగ్ ↕',
    'offshore node x': 'విదేశీ నోడ్ X',
    'upi spoof server': 'UPI స్పూఫ్ సర్వర్',
    'hosted domain ↕': 'హోస్ట్ చేసిన డొమైన్ ↕',
    'suspect c': 'అనుమానితుడు C',
    'recruiter ↕': 'రిక్రూటర్ ↕',
    'sender account': 'పంపినవారి ఖాతా',
    'mule account a': 'మ్యూల్ ఖాతా A',
    'atm cashout ↕': 'ATM విత్‌డ్రా ↕',
    'suspect node x': 'అనుమానిత నోడ్ X',
    'suspect a': 'అనుమానితుడు A',
    'suspect b': 'అనుమానితుడు B',
    'asset dump ↕': 'ఆస్తుల అమ్మకం ↕',
    'unknown node': 'తెలియని నోడ్',
    'indirect link ↕': 'పరోక్ష లింక్ ↕',
    'query subject': 'విచారణ అంశం',
    'associate ↕': 'సహచరుడు ↕',

    // Historical Cases
    'kr market theft case #809': 'KR మార్కెట్ దొంగతనం కేసు #809',
    'upi phishing scam #101': 'UPI ఫిషింగ్ స్కామ్ #101',
    'bank spoofing investigation #202': 'బ్యాంక్ స్పూఫింగ్ విచారణ #202',
    'upi scam #305': 'UPI స్కామ్ #305',
    'layering scheme #302': 'లేయరింగ్ స్కీమ్ #302',
    'mule network investigation #909': 'మ్యూల్ నెట్‌వర్క్ విచారణ #909',
    'burglary syndicate ring #110': 'దొంగతనాల ముఠా రింగ్ #110',
    'mysuru handbag snatching #402': 'మైసూర్ హ్యాండ్‌బ్యాగ్ లాగివేత #402',
    'general investigation #404': 'సాధారణ విచారణ #404',

    // Action Chips
    'show linked suspects': 'లింక్ చేయబడిన అనుమానితులను చూపించు',
    'view crime locations': 'నేర ప్రాంతాలను వీక్షించు',
    'check previous firs': 'గత FIRలను తనిఖీ చేయి',
    'generate report': 'నివేదికను సృష్టించు',
    'view related cases': 'సంబంధిత కేసులను వీక్షించు',
    'analyze risk score': 'ప్రమాద స్కోరును విశ్లేషించు',
    '✓ show linked suspects': '✓ లింక్ చేయబడిన అనుమానితులను చూపించు',
    '✓ view crime locations': '✓ నేర ప్రాంతాలను వీక్షించు',
    '✓ check previous firs': '✓ గత FIRలను తనిఖీ చేయి',
    '✓ generate report': '✓ నివేదికను సృష్టించు',
    '✓ freeze beneficiary accounts': '✓ లబ్ధిదారుల ఖాతాలను ఫ్రీజ్ చేయి',
    '✓ view related cases': '✓ संबंधित కేసులను వీక్షించు',
    '✓ analyze risk score': '✓ ప్రమాద స్కోరును విశ్లేషించు',

    // Default Hotspot Locations
    'bengaluru urban': 'బెంగళూరు అర్బన్',
    'mysuru': 'మైసూరు',
    'hubli': 'హుబ్లి',

    // Timeline Milestone Events
    'fir registered': 'FIR నమోదు చేయబడింది',
    'case recorded in precinct file.': 'కేసు పోలీస్ స్టేషన్ ఫైల్‌లో నమోదు చేయబడింది.',
    'suspect cross-referenced': 'అనుమానితుడి వివరాలు సరిపోల్చబడ్డాయి',
    'identified offender records in database.': 'డేటాబేస్‌లో నేరస్థుడి రికార్డులు గుర్తించబడ్డాయి.',
    'prior convictions fetched': 'గత నేర చరిత్ర వివరాలు సేకరించబడ్డాయి',
    'retrieved 3 historical arrest reports.': '3 గత అరెస్టు నివేదికలు సేకరించబడ్డాయి.',
    'watchlist updated': 'వాచ్‌లిస్ట్ అప్‌డేట్ చేయబడింది',
    'placed suspect under active surveillance.': 'అనుమానితుడిపై నిఘా పెట్టడం జరిగింది.',
    'credential harvesting alert': 'క్రెడెన్షియల్ హార్వెస్టింగ్ అలర్ట్',
    'victim reported credential phishing site.': 'బాధితుడు ఫిషింగ్ సైట్ గురించి ఫిర్యాదు చేసాడు.',
    'ip addresses decrypted': 'IP అడ్రస్సులు డీక్రిప్ట్ చేయబడ్డాయి',
    'traced proxy originating headers.': 'ప్రాక్సీ ఆధారిత హెడర్లను గుర్తించడం జరిగింది.',
    'accounts flagged': 'ఖాతాలు ఫ్లాగ్ చేయబడ్డాయి',
    'flagged 5 target transaction accounts.': '5 లావాదేవీల ఖాతాలను ఫ్లాగ్ చేయడం జరిగింది.',
    'assets frozen': 'ఆస్తులు ఫ్రీజ్ చేయబడ్డాయి',
    'secured court warrant to hold target assets.': 'ఆస్తులను స్వాధీనం చేసుకోవడానికి కోర్టు వారెంట్ పొందడం జరిగింది.',
    'syndicate profile created': 'ముఠా ప్రొఫైల్ సృష్టించబడింది',
    'linked suspect phone exchanges mapped.': 'అనుమానితుల ఫోన్ సంభాషణలు మ్యాప్ చేయబడ్డాయి.',
    'log subpoenas served': 'కాల్ రికార్డుల కోర్టు ఆదేశాలు జారీ చేయబడ్డాయి',
    'call data records subpoenaed for 7 nodes.': '7 నెంబర్ల కాల్ రికార్డులను సేకరించడం జరిగింది.',
    'syndicate tree plotted': 'ముఠా నెట్‌వర్క్ ప్లాట్ చేయబడింది',
    'linked suspect map registered in case file.': 'అనుమానితుల నెట్‌వర్క్ మ్యాప్ కేస్ ఫైల్‌లో నమోదు చేయబడింది.',
    'warrants issued': 'వారెంట్లు జారీ చేయబడ్డాయి',
    'magistrate signed search and capture warrants.': 'మెజిస్ట్రేట్ సోదాలు మరియు అరెస్టు వారెంట్లపై సంతకం చేసాడు.',
    'clustered rates logged': 'నేరాల వివరాలు నమోదు చేయబడ్డాయి',
    'incident rates tracked in majestic bus stand.': 'మెజస్టిక్ బస్టాండ్ వద్ద నేరాల రేటును గమనించడం జరిగింది.',
    'patrol dispatch alert': 'పెట్రోలింగ్ అలర్ట్',
    'increased tactical sweeps dispatched to target areas.': 'ఉద్దేశిత ప్రాంతాలకు అదనపు పెట్రోలింగ్ వాహనాలను పంపడం జరిగింది.',
    'hotspots model updated': 'హాట్‌స్పాట్ మోడల్ అప్‌డేట్ చేయబడింది',
    'patrol map routes recalculated.': 'పెట్రోలింగ్ మార్గాలు పునర్నిర్మించబడ్డాయి.',
    'crime rates reduced': 'నేరాల రేటు తగ్గింది',
    'local precinct reported 30% reduction in local thefts.': 'స్థానిక పోలీస్ స్టేషన్ పరిధిలో దొంగతనాలు 30% తగ్గినట్లు నివేదించారు.'
  },

  // Malayalam Mappings
  ml: {
    // Query Mappings
    'show repeat offenders': 'ആവർത്തിച്ചുള്ള കുറ്റവാളികളെ കാണിക്കുക',
    'show repeat offenders in bengaluru': 'ബംഗളൂരുവിൽ ആവർത്തിച്ചുള്ള കുറ്റവാളികളെ കാണിക്കുക',
    'only in bengaluru': 'ബംഗളൂരുവിൽ മാത്രം',
    'only in mysuru': 'മൈസൂരിൽ മാത്രം',
    'show crime hotspots': 'കുറ്റകൃത്യ ഹോട്ട്‌സ്‌പോട്ടുകൾ കാണിക്കുക',
    'show cybercrime cases': 'സൈബർ ക്രൈം കേസുകൾ കാണിക്കുക',
    'show financial fraud suspects': 'സാമ്പത്തിക തട്ടിപ്പ് പ്രതികളെ കാണിക്കുക',
    'show high risk offenders': 'ഉയർന്ന അപകടസാധ്യതയുള്ള കുറ്റവാളികളെ കാണിക്കുക',
    'find linked cases': 'ബന്ധിപ്പിച്ച കേസുകൾ കണ്ടെത്തുക',
    'find suspects connected to cyber fraud': 'സൈബർ തട്ടിപ്പുമായി ബന്ധമുള്ള പ്രതികളെ കണ്ടെത്തുക',

    // Verbal Replies & Summaries
    'found 2 repeat offenders active in bengaluru: kiran kumar and rajesh sekhar': 'ബംഗളൂരുവിൽ സജീവമായ 2 ആവർത്തിച്ചുള്ള കുറ്റവാളികളെ കണ്ടെത്തി: കിരൺ കുമാർ, രാജേഷ് ശേഖർ.',
    'filtered 2 repeat offenders linked to bengaluru majestic transit logs and local precincts': 'ബെംഗളൂരു മജസ്റ്റിക് ട്രാൻസിറ്റ് ലോഗുകളുമായും പ്രാദേശിക പോലീസ് സ്റ്റേഷനുകളുമായും ബന്ധിപ്പിച്ചിട്ടുള്ള 2 ആവർത്തിച്ചുള്ള കുറ്റവാളികളെ ഫിൽട്ടർ ചെയ്തു.',
    'found 3 suspects connected to cyber fraud ring': 'സൈബർ തട്ടിപ്പ് സംഘവുമായി ബന്ധമുള്ള 3 പ്രതികളെ കണ്ടെത്തി.',
    'suspect network analysis shows coordination on upi spoofing and mule bank accounts': 'പ്രതികളുടെ നെറ്റ്‌വർക്ക് വിശകലനം യുപിഐ സ്പൂഫിംഗിലും മ്യൂൾ ബാങ്ക് അക്കൗണ്ടുകളിലും ഉള്ള ഏകോപനം കാണിക്കുന്നു.',
    'cybercrime complaints increased by 18% this month, primarily upi phishing': 'ഈ മാസം സൈബർ ക്രൈം പരാതികൾ 18% വർദ്ധിച്ചു, പ്രധാനമായും യുപിഐ ഫിഷിംഗ്.',
    'cybercrime complaints increased by 18% this month, primarily upi phishing and credentials harvesting': 'ഈ മാസം സൈബർ ക്രൈം പരാതികൾ 18% വർദ്ധിച്ചു, പ്രധാനമായും യുപിഐ ഫിഷിംഗും ക്രെഡൻഷ്യൽസ് ചോർത്തലും.',
    'suspicious transactions identified across 5 accounts linked to suspect nodes': 'പ്രതികളുമായി ബന്ധിപ്പിച്ചിട്ടുള്ള 5 അക്കൗണ്ടുകളിൽ സംശയാസ്പദമായ ഇടപാടുകൾ കണ്ടെത്തി.',
    'suspicious transactions identified across 5 bank accounts representing layered shell entities': 'ലെയർ ഷെൽ സ്ഥാപനങ്ങളെ പ്രതിനിധീകരിക്കുന്ന 5 ബാങ്ക് അക്കൗണ്ടുകളിൽ സംശയാസ്പദമായ ഇടപാടുകൾ കണ്ടെത്തി.',
    'detected active burglary syndicate with elevated risk score': 'കൂടുതൽ അപകടസാധ്യതയുള്ള സജീവ കവർച്ച സംഘത്തെ കണ്ടെത്തി.',
    'burglary and fencing syndicate active on city borders with a high-risk score of 95/100': '95/100 ഉയർന്ന അപകടസാധ്യതയുള്ള നഗര അതിർത്തികളിൽ കവർച്ചയും മോഷണമുതൽ വിൽപനയും നടത്തുന്ന സംഘം സജീവമാണ്.',
    'identified cross-jurisdictional links between 3 active theft investigations': '3 സജീവ കവർച്ചാ അന്വേഷണങ്ങൾ തമ്മിൽ വിവിധ അധികാരപരിധികളിലുള്ള ബന്ധങ്ങൾ കണ്ടെത്തി.',
    'cross-jurisdictional correlation shows same modus operandi across majestic and mysuru cases': 'വിവിധ അധികാരപരിധിയിലുള്ള താരതമ്യം മജസ്റ്റിക്, മൈസൂർ കേസുകളിൽ ഒരേ രീതിയിലുള്ള കുറ്റകൃത്യ ശൈലി കാണിക്കുന്നു.',
    'analyzing available crime intelligence data': 'ലഭ്യമായ കുറ്റകൃത്യ അന്വേഷണ വിവരങ്ങൾ വിശകലനം ചെയ്യുന്നു.',
    'analyzing available crime intelligence data in databases no active alert thresholds triggered': 'ഡാറ്റാബേസുകളിലെ ലഭ്യമായ കുറ്റകൃത്യ അന്വേഷണ വിവരങ്ങൾ വിശകലനം ചെയ്യുന്നു. സജീവമായ മുന്നറിയിപ്പ് പരിധികളൊന്നും പ്രവർത്തനക്ഷമമായിട്ടില്ല.',

    // Reasoning Points
    'linked to 4 bengaluru majestic fir files': '4 ബെംഗളൂരു മജസ്റ്റിക് എഫ്ഐആർ ഫയലുകളുമായി ബന്ധിപ്പിച്ചിരിക്കുന്നു',
    'appeared in bengaluru hotspot zones (majestic, kr market)': 'ബെംഗളൂരുവിലെ ഹോട്ട്‌സ്‌പോട്ട് മേഖലകളിൽ (മജസ്റ്റിക്, കെആർ മാർക്കറ്റ്) പ്രത്യക്ഷപ്പെട്ടു',
    'observed coordinates correlation': 'കോർഡിനേറ്റുകളുടെ പരസ്പരബന്ധം കണ്ടെത്തി',
    'direct call log matches to offshore hosts': 'വിദേശ ഹോസ്റ്റുകളുമായുള്ള നേരിട്ടുള്ള കോൾ ലോഗ് പൊരുത്തങ്ങൾ',
    'wired funds to mule networks': 'മ്യൂൾ നെറ്റ്‌വർക്കുകളിലേക്ക് പണം അയച്ചു',
    'ip matches on spoof admin accounts': 'വ്യാജ അഡ്മിൻ അക്കൗണ്ടുകളിലെ ഐപി പൊരുത്തങ്ങൾ',
    'spike in credential phishing urls detected': 'ക്രെഡൻഷ്യൽ ഫിഷിംഗ് യുആർഎല്ലുകളിൽ വലിയ വർദ്ധനവ് കണ്ടെത്തി',
    'proxy servers traced to foreign domains': 'വിദേശ ഡൊമെയ്‌നുകളിലേക്ക് പ്രോക്സി സെർവറുകൾ കണ്ടെത്തി',
    'upi spoof applications identified': 'യുപിഐ വ്യാജ ആപ്ലിക്കേഷനുകൾ കണ്ടെത്തി',
    'rapid transit of funds across shell entities': 'ഷെൽ സ്ഥാപനങ്ങൾക്കിടയിൽ വേഗതയേറിയ പണമിടപാടുകൾ',
    'amounts structured below reporting limits': 'റിപ്പോർട്ടിംഗ് പരിധിയേക്കാൾ കുറഞ്ഞ തുകയിലുള്ള ഇടപാടുകൾ',
    'linked to known financial fraud offenders': 'അറിയപ്പെടുന്ന സാമ്പത്തിക തട്ടിപ്പ് കുറ്റവാളികളുമായി ബന്ധിപ്പിച്ചിരിക്കുന്നു',
    'direct links between 7 co-conspirators': '7 സഹഗൂഢാലോചനക്കാർ തമ്മിലുള്ള നേരിട്ടുള്ള ബന്ധങ്ങൾ',
    'shared communications logs during crimes': 'കുറ്റകൃത്യങ്ങൾക്കിടയിൽ പങ്കിട്ട ആശയവിനിമയ വിവരങ്ങൾ',
    'fencing operations located on city perimeter': 'നഗര അതിർത്തിയിൽ സ്ഥിതി ചെയ്യുന്ന മോഷണമുതൽ വിൽപന കേന്ദ്രങ്ങൾ',
    'similar lock-breaking tools used': 'പൂട്ടുകൾ പൊളിക്കാൻ ഒരേ രീതിയിലുള്ള ഉപകരണങ്ങൾ ഉപയോഗിച്ചു',
    'offender coordinates match transit logs': 'കുറ്റവാളിയുടെ കോർഡിനേറ്റുകൾ ട്രാൻസിറ്റ് ലോഗുകളുമായി പൊരുത്തപ്പെടുന്നു',
    'related fence networks observed': 'ബന്ധപ്പെട്ട മോഷണമുതൽ വിൽപന ശൃംഖലകൾ കണ്ടെത്തി',
    'no prior conviction match identified': 'മുൻകാല കുറ്റവിധി പൊരുത്തങ്ങളൊന്നും കണ്ടെത്തിയില്ല',
    'current location outside identified hotspot areas': 'നിലവിലെ സ്ഥാനം കണ്ടെത്തിയ ഹോട്ട്‌സ്‌പോട്ട് മേഖലകൾക്ക് പുറത്താണ്',
    'no direct links to active suspects found': 'സജീവ പ്രതികളുമായി നേരിട്ടുള്ള ബന്ധങ്ങളൊന്നും കണ്ടെത്തിയില്ല',

    // Recommendations
    'audit majestic transit logs': 'മജസ്റ്റിക് ട്രാൻസിറ്റ് ലോഗുകൾ ഓഡിറ്റ് ചെയ്യുക',
    'establish night watch at majestic bus stand': 'മജസ്റ്റിക് ബസ് സ്റ്റാൻഡിൽ രാത്രി നിരീക്ഷണം ഏർപ്പെടുത്തുക',
    'freeze mule bank accounts': 'മ്യൂൾ ബാങ്ക് അക്കൗണ്ടുകൾ മരവിപ്പിക്കുക',
    'subpoena gateway communication logs': 'ഗേറ്റ്‌വേ ആശയവിനിമയ ലോഗുകൾ കോടതി വഴി ആവശ്യപ്പെടുക',
    'subpoena server host logs': 'സെർവർ ഹോസ്റ്റ് ലോഗുകൾ കോടതി വഴി ആവശ്യപ്പെടുക',
    'notify banking upi gateways': 'ബാങ്കിംഗ് യുപിഐ ഗേറ്റ്‌വേകളെ അറിയിക്കുക',
    'request dns takedown of phishing domain': 'ഫിഷിംഗ് ഡൊമെയ്‌ൻ്റെ ഡിഎൻഎസ് നീക്കം ചെയ്യാൻ ആവശ്യപ്പെടുക',
    'notify financial intelligence unit': 'ഫിനാൻഷ്യൽ ഇന്റലിജൻസ് യൂണിറ്റിനെ അറിയിക്കുക',
    'freeze beneficiary accounts': 'ഗുണഭോക്തൃ അക്കൗണ്ടുകൾ മരവിപ്പിക്കുക',
    'execute simultaneous warrants': 'ഒരേസമയം വാറണ്ടുകൾ നടപ്പിലാക്കുക',
    'block asset sales channels': 'സ്വത്ത് വിൽപന മാർഗങ്ങൾ തടയുക',
    'audit shared fencing accounts': 'മോഷണമുതൽ വിൽപന സംയുക്ത അക്കൗണ്ടുകൾ ഓഡിറ്റ് ചെയ്യുക',
    'coordinate across precinct teams': 'വിവിധ സ്റ്റേഷൻ ടീമുകൾ തമ്മിൽ ഏകോപിപ്പിക്കുക',
    'monitor local precinct registries': 'പ്രാദേശിക സ്റ്റേഷൻ രജിസ്ട്രികൾ നിരീക്ഷിക്കുക',
    'verify identification documents': 'തിരിച്ചറിയൽ രേഖകൾ പരിശോധിക്കുക',

    // Hotspot Locations & Risks
    'bengaluru majestic': 'ബംഗളൂരു മജസ്റ്റിക്',
    'kr market hub': 'കെആർ മാർക്കറ്റ് ഹബ്',
    'electronic city tech zone': 'ഇലക്ട്രോണിക് സിറ്റി ടെക് സോൺ',
    'whitefield hub': 'വൈറ്റ്ഫീൽഡ് ഹബ്',
    'electronic city': 'ഇലക്ട്രോണിക് സിറ്റി',
    'central business district': 'സെൻട്രൽ ബിസിനസ് ഡിസ്ട്രിക്റ്റ്',
    'offshore node traces': 'വിദേശ നോഡ് അടയാളങ്ങൾ',
    'bengaluru outer ring': 'ബംഗളൂരു ഔട്ടർ റിംഗ്',
    'mysuru highway': 'മൈസൂർ ഹൈവേ',
    'mysuru junction': 'മൈസൂർ ജംഗ്ഷൻ',
    'hubli junction': 'ഹുബ്ലി ജംഗ്ഷൻ',
    'high': 'ഉയർന്ന',
    'medium': 'മിതമായ',
    'low': 'കുറഞ്ഞ',

    // Network Node Labels & Relations
    'co-accused ↕': 'സഹപ്രതി ↕',
    'suspect c (phisher)': 'പ്രതി സി (ഫിഷർ)',
    'wire transfer ↕': 'ബാങ്ക് ട്രാൻസ്ഫർ ↕',
    'mule account group': 'മ്യൂൾ അക്കൗണ്ട് ഗ്രൂപ്പ്',
    'call log ↕': 'കോൾ ലോഗ് ↕',
    'offshore node x': 'വിദേശ നോഡ് എക്സ്',
    'upi spoof server': 'യുപിഐ വ്യാജ സെర్വർ',
    'hosted domain ↕': 'ഹോസ്റ്റ് ചെയ്ത ഡൊമെയ്ൻ ↕',
    'suspect c': 'പ്രതി സി',
    'recruiter ↕': 'ആളുകളെ ചേർക്കുന്നയാൾ ↕',
    'sender account': 'അയച്ചയാളുടെ അക്കൗണ്ട്',
    'mule account a': 'മ്യൂൾ അക്കൗണ്ട് എ',
    'atm cashout ↕': 'എടിഎം പണം പിൻവലിക്കൽ ↕',
    'suspect node x': 'പ്രതി നോഡ് എക്സ്',
    'suspect a': 'പ്രതി എ',
    'suspect b': 'പ്രതി ബി',
    'asset dump ↕': 'സ്വത്ത് വിൽപന ↕',
    'unknown node': 'അജ്ഞാത നോഡ്',
    'indirect link ↕': 'പരോക്ഷ ബന്ധം ↕',
    'query subject': 'അന്വേഷണ വിഷയം',
    'associate ↕': 'സഹായി ↕',

    // Historical Cases
    'kr market theft case #809': 'കെആർ മാർക്കറ്റ് കവർച്ച കേസ് #809',
    'upi phishing scam #101': 'യുപിഐ ഫിഷിംഗ് തട്ടിപ്പ് #101',
    'bank spoofing investigation #202': 'ബാങ്ക് സ്പൂഫിംഗ് അന്വേഷണം #202',
    'upi scam #305': 'യുപിഐ തട്ടിപ്പ് #305',
    'layering scheme #302': 'ലെയറിംഗ് പദ്ധതി #302',
    'mule network investigation #909': 'മ്യൂൾ നെറ്റ്‌വർക്ക് അന്വേഷണം #909',
    'burglary syndicate ring #110': 'കവർച്ചാ സംഘം #110',
    'mysuru handbag snatching #402': 'മൈസൂർ ഹാൻഡ്‌ബാഗ് തട്ടിപ്പറിക്കൽ #402',
    'general investigation #404': 'പൊതു അന്വേഷണം #404',

    // Action Chips
    'show linked suspects': 'ബന്ധമുള്ള പ്രതികളെ കാണിക്കുക',
    'view crime locations': 'കുറ്റകൃത്യ സ്ഥലങ്ങൾ കാണുക',
    'check previous firs': 'മുൻകാല എഫ്ഐആറുകൾ പരിശോധിക്കുക',
    'generate report': 'റിപ്പോർട്ട് തയ്യാറാക്കുക',
    'view related cases': 'ബന്ധപ്പെട്ട കേസുകൾ കാണുക',
    'analyze risk score': 'അപകടസാധ്യത വിശകലനം ചെയ്യുക',
    '✓ show linked suspects': '✓ ബന്ധമുള്ള പ്രതികളെ കാണിക്കുക',
    '✓ view crime locations': '✓ കുറ്റകൃത്യ സ്ഥലങ്ങൾ കാണുക',
    '✓ check previous firs': '✓ മുൻകാല എഫ്ഐആറുകൾ പരിശോധിക്കുക',
    '✓ generate report': '✓ റിപ്പോർട്ട് തയ്യാറാക്കുക',
    '✓ freeze beneficiary accounts': '✓ ഗുണഭോക്തൃ അക്കൗണ്ടുകൾ മരവിപ്പിക്കുക',
    '✓ view related cases': '✓ ബന്ധപ്പെട്ട കേസുകൾ കാണുക',
    '✓ analyze risk score': '✓ അപകടസാധ്യത വിശകലനം ചെയ്യുക',

    // Default Hotspot Locations
    'bengaluru urban': 'ബംഗളൂരു അർബൻ',
    'mysuru': 'മൈസൂർ',
    'hubli': 'ഹുബ്ലി',

    // Timeline Milestone Events
    'fir registered': 'എഫ്‌ഐആർ രജിസ്റ്റർ ചെയ്തു',
    'case recorded in precinct file.': 'കേസ് പോലീസ് സ്റ്റേഷൻ ഫയലിൽ രേഖപ്പെടുത്തി.',
    'suspect cross-referenced': 'പ്രതിയെ ക്രോസ് റഫറൻസ് ചെയ്തു',
    'identified offender records in database.': 'ഡാറ്റാബേസിൽ കുറ്റവാളിയുടെ വിവരങ്ങൾ കണ്ടെത്തി.',
    'prior convictions fetched': 'മുൻകാല കുറ്റവിധി വിവരങ്ങൾ ശേഖരിച്ചു',
    'retrieved 3 historical arrest reports.': '3 മുൻകാല അറസ്റ്റ് റിപ്പോർട്ടുകൾ ശേഖരിച്ചു.',
    'watchlist updated': 'വാച്ച് ലിസ്റ്റ് പുതുക്കി',
    'placed suspect under active surveillance.': 'പ്രതിയെ സജീവ നിരീക്ഷണത്തിലാക്കി.',
    'credential harvesting alert': 'ക്രെഡൻഷ്യൽ ചോർത്തൽ മുന്നറിയിപ്പ്',
    'victim reported credential phishing site.': 'ഇരയാക്കപ്പെട്ടയാൾ ഫിഷിംഗ് സൈറ്റിനെക്കുറിച്ച് പരാതിപ്പെട്ടു.',
    'ip addresses decrypted': 'ഐപി വിലാസങ്ങൾ ഡീക്രിപ്റ്റ് ചെയ്തു',
    'traced proxy originating headers.': 'പ്രോക്സി ഒറിജിനേറ്റിംഗ് ഹെഡറുകൾ കണ്ടെത്തി.',
    'accounts flagged': 'അക്കൗണ്ടുകൾ ഫ്ലാഗ് ചെയ്തു',
    'flagged 5 target transaction accounts.': '5 ഇടപാട് അക്കൗണ്ടുകൾ ഫ്ലാഗ് ചെയ്തു.',
    'assets frozen': 'സ്വത്തുക്കൾ മരവിപ്പിച്ചു',
    'secured court warrant to hold target assets.': 'സ്വത്തുക്കൾ മരവിപ്പിക്കാൻ കോടതി ഉത്തരവ് നേടി.',
    'syndicate profile created': 'സംഘത്തിന്റെ പ്രൊഫൈൽ തയ്യാറാക്കി',
    'linked suspect phone exchanges mapped.': 'പ്രതികളുടെ ഫോൺ കോൾ വിവരങ്ങൾ മാപ്പ് ചെയ്തു.',
    'log subpoenas served': 'രേഖകൾ ആവശ്യപ്പെട്ട് കോടതി സമൻസ് അയച്ചു',
    'call data records subpoenaed for 7 nodes.': '7 ഫോൺ നമ്പറുകളുടെ കോൾ വിവരങ്ങൾ സമൻസ് വഴി ആവശ്യപ്പെട്ടു.',
    'syndicate tree plotted': 'സംഘത്തിന്റെ ബന്ധങ്ങൾ മാപ്പ് ചെയ്തു',
    'linked suspect map registered in case file.': 'പ്രതികളുടെ മാപ്പ് കേസ് ഫയലിൽ രേഖപ്പെടുത്തി.',
    'warrants issued': 'വാറണ്ടുകൾ പുറപ്പെടുവിച്ചു',
    'magistrate signed search and capture warrants.': 'മജിസ്‌ട്രേറ്റ് സെർച്ച്, അറസ്റ്റ് വാറണ്ടുകളിൽ ഒപ്പുവെച്ചു.',
    'clustered rates logged': 'കുറ്റകൃത്യങ്ങളുടെ വിവരങ്ങൾ രേഖപ്പെടുത്തി',
    'incident rates tracked in majestic bus stand.': 'മജസ്റ്റിക് ബസ് സ്റ്റാൻഡിലെ കുറ്റകൃത്യങ്ങളുടെ നിരക്ക് നിരീക്ഷിച്ചു.',
    'patrol dispatch alert': 'പട്രോളിംഗ് മുന്നറിയിപ്പ്',
    'increased tactical sweeps dispatched to target areas.': 'തിരഞ്ഞെടുത്ത മേഖലകളിൽ പട്രോളിംഗ് വർദ്ധിപ്പിച്ചു.',
    'hotspots model updated': 'ഹോട്ട്‌സ്‌പോട്ട് മാപ്പ് പുതുക്കി',
    'patrol map routes recalculated.': 'പട്രോളിംഗ് റൂട്ടുകൾ പുനർക്രമീകരിച്ചു.',
    'crime rates reduced': 'കുറ്റകൃത്യങ്ങൾ കുറഞ്ഞു',
    'local precinct reported 30% reduction in local thefts.': 'പ്രാദേശിക പോലീസ് സ്റ്റേഷൻ പരിധിയിൽ മോഷണങ്ങൾ 30% കുറഞ്ഞു.'
  },
  bn: {
    // Query Mappings
    'show repeat offenders': 'বারংবার অপরাধীদের দেখাও',
    'show repeat offenders in bengaluru': 'বেঙ্গালুরুতে বারংবার অপরাধীদের দেখাও',
    'only in bengaluru': 'কেবল বেঙ্গালুরুতে',
    'only in mysuru': 'কেবল মহীশূরে',
    'show crime hotspots': 'অপরাধ হটস্পট দেখাও',
    'show cybercrime cases': 'সাইবার অপরাধের মামলা দেখাও',
    'show financial fraud suspects': 'আর্থিক প্রতারণার সন্দেহভাজনদের দেখাও',
    'show high risk offenders': 'উচ্চ ঝুঁকিপূর্ণ অপরাধীদের দেখাও',
    'find linked cases': 'সংযুক্ত মামলা খুঁজুন',
    'find suspects connected to cyber fraud': 'সাইবার প্রতারণার সাথে যুক্ত সন্দেহভাজনদের খুঁজুন',

    // Verbal Replies & Summaries
    'found 2 repeat offenders active in bengaluru: kiran kumar and rajesh sekhar': 'বেঙ্গালুরুতে সক্রিয় ২ জন বারংবার অপরাধী পাওয়া গেছে: কিরণ কুমার এবং রাজেশ শেখর।',
    'filtered 2 repeat offenders linked to bengaluru majestic transit logs and local precincts': 'বেঙ্গালুরু মেজেস্টিক ট্রানজিট লগ এবং স্থানীয় থানার সাথে যুক্ত ২ জন বারংবার অপরাধীকে ফিল্টার করা হয়েছে।',
    'found 3 suspects connected to cyber fraud ring': 'সাইবার প্রতারণা চক্রের সাথে যুক্ত ৩ জন সন্দেহভাজন পাওয়া গেছে।',
    'suspect network analysis shows coordination on upi spoofing and mule bank accounts': 'সন্দেহভাজন নেটওয়ার্ক বিশ্লেষণ ইউপিআই স্পুফিং এবং মিউল ব্যাঙ্ক অ্যাকাউন্টের সমন্বয় দেখায়।',
    'cybercrime complaints increased by 18% this month, primarily upi phishing': 'এই মাসে সাইবার অপরাধের অভিযোগ ১৮% বৃদ্ধি পেয়েছে, প্রধানত ইউপিআই ফিশিং।',
    'cybercrime complaints increased by 18% this month, primarily upi phishing and credentials harvesting': 'এই মাসে সাইবার অপরাধের অভিযোগ ১৮% বৃদ্ধি পেয়েছে, প্রধানত ইউপিআই ফিশিং এবং তথ্য সংগ্রহ।',
    'suspicious transactions identified across 5 accounts linked to suspect nodes': 'সন্দেহভাজন নোডের সাথে যুক্ত ৫টি অ্যাকাউন্টে সন্দেহজনক লেনদেন চিহ্নিত করা হয়েছে।',
    'suspicious transactions identified across 5 bank accounts representing layered shell entities': 'স্তরীভূত শেল সত্তার প্রতিনিধিত্বকারী ৫টি ব্যাঙ্ক অ্যাকাউন্টে সন্দেহজনক লেনদেন চিহ্নিত করা হয়েছে।',
    'detected active burglary syndicate with elevated risk score': 'উচ্চ ঝুঁকির স্কোরের সাথে সক্রিয় সিঁধেল চোর চক্র সনাক্ত করা হয়েছে।',
    'burglary and fencing syndicate active on city borders with a high-risk score of 95/100': '৯৫/১০০ এর উচ্চ ঝুঁকির স্কোরের সাথে শহরের সীমান্তে সিঁধেল চুরি এবং চোরাই মাল কেনাবেচার চক্র সক্রিয়।',
    'identified cross-jurisdictional links between 3 active theft investigations': '৩টি সক্রিয় চুরি তদন্তের মধ্যে আন্তঃ-অধিক্ষেত্রীয় সংযোগ সনাক্ত করা হয়েছে।',
    'cross-jurisdictional correlation shows same modus operandi across majestic and majestic cases': 'আন্তঃ-অধিক্ষেত্রীয় পারস্পরিক সম্পর্ক মেজেস্টিক এবং মহীশূর মামলার মধ্যে একই কার্যপ্রণালী দেখায়।',
    'analyzing available crime intelligence data': 'উপলব্ধ অপরাধের গোয়েন্দা তথ্য বিশ্লেষণ করা হচ্ছে।',
    'analyzing available crime intelligence data in databases no active alert thresholds triggered': 'ডেটাবেসে উপলব্ধ অপরাধের গোয়েন্দা তথ্য বিশ্লেষণ করা হচ্ছে। কোনো সক্রিয় সতর্কতা থ্রেশহোল্ড ট্রিগার হয়নি।',

    // Reasoning Points
    'linked to 4 bengaluru majestic fir files': '৪টি বেঙ্গালুরু মেজেস্টিক এফআইআর ফাইলের সাথে যুক্ত',
    'appeared in bengaluru hotspot zones (majestic, kr market)': 'বেঙ্গালুরু হটস্পট জোনে (মেজেস্টিক, কেআর মার্কেট) দেখা গেছে',
    'observed coordinates correlation': 'স্থানাঙ্কের পারস্পরিক সম্পর্ক পরিলক্ষিত হয়েছে',
    'direct call log matches to offshore hosts': 'অফশোর হোস্টের সাথে সরাসরি কল লগ মিলেছে',
    'wired funds to mule networks': 'মিউল নেটওয়ার্কে তহবিল পাঠানো হয়েছে',
    'ip matches on spoof admin accounts': 'স্পুফ অ্যাডমিন অ্যাকাউন্টে আইপি মিলেছে',
    'spike in credential phishing urls detected': 'তথ্য সংগ্রহের ফিশিং ইউআরএল-এর সংখ্যায় আকস্মিক বৃদ্ধি সনাক্ত করা হয়েছে',
    'proxy servers traced to foreign domains': 'বিদেশী ডোমেনে প্রক্সি সার্ভার ট্রেস করা হয়েছে',
    'upi spoof applications identified': 'ইউপিআই স্পুফ অ্যাপ্লিকেশন সনাক্ত করা হয়েছে',
    'rapid transit of funds across shell entities': 'শেল সত্তা জুড়ে তহবিলের দ্রুত স্থানান্তর',
    'amounts structured below reporting limits': 'রিপোর্টিং সীমার নিচে বিন্যস্ত পরিমাণ',
    'linked to known financial fraud offenders': 'পরিচিত আর্থিক প্রতারণা অপরাধীদের সাথে যুক্ত',
    'direct links between 7 co-conspirators': '৭ জন সহ-षড়যন্ত্রকারীর মধ্যে সরাসরি সংযোগ',
    'shared communications logs during crimes': 'অপরাধের সময় যোগাযোগ লগ শেয়ার করা হয়েছে',
    'fencing operations located on city perimeter': 'শহরের সীমান্তে চোরাই মাল কেনাবেচার কার্যক্রম অবস্থিত',
    'similar lock-breaking tools used': 'অনুরূপ তালা ভাঙার সরঞ্জাম ব্যবহার করা হয়েছে',
    'offender coordinates match transit logs': 'অপরাধীর স্থানাঙ্ক ট্রানজিট লগের সাথে মিলেছে',
    'related fence networks observed': 'চোরাই মাল কেনাবেচার সাথে সম্পর্কিত নেটওয়ার্ক পরিলক্ষিত হয়েছে',
    'no prior conviction match identified': 'কোনো পূর্ববর্তী অপরাধের রেকর্ড মেলেনি',
    'current location outside identified hotspot areas': 'বর্তমান অবস্থান চিহ্নিত হটস্পট এলাকার বাইরে',
    'no direct links to active suspects found': 'সক্রিয় সন্দেহভাজনদের সাথে কোনো সরাসরি সংযোগ পাওয়া যায়নি',

    // Recommendations
    'audit majestic transit logs': 'মেজেস্টিক ট্রানজিট লগ অডিট করুন',
    'establish night watch at majestic bus stand': 'মেজেস্টিক বাস স্ট্যান্ডে নৈশ প্রহরা স্থাপন করুন',
    'freeze mule bank accounts': 'মিউল ব্যাঙ্ক অ্যাকাউন্টগুলি ফ্রিজ করুন',
    'subpoena gateway communication logs': 'গেটওয়ে যোগাযোগ লগের সাবপোনা জারি করুন',
    'subpoena server host logs': 'সার্ভার হোস্ট লগের সাবপোনা জারি করুন',
    'notify banking upi gateways': 'ব্যাঙ্কিং ইউপিআই গেটওয়েকে অবহিত করুন',
    'request dns takedown of phishing domain': 'ফিশিং ডোমেন বন্ধের জন্য অনুরোধ করুন',
    'notify financial intelligence unit': 'আর্থিক গোয়েন্দা সংস্থাকে অবহিত করুন',
    'freeze beneficiary accounts': 'সুবিধাভোগী অ্যাকাউন্টগুলি ফ্রিজ করুন',
    'execute simultaneous warrants': 'একযোগে ওয়ারেন্ট কার্যকর করুন',
    'block asset sales channels': 'সম্পত্তি বিক্রয়ের চ্যানেলগুলি ব্লক করুন',
    'audit shared fencing accounts': 'চোরাই মালের অংশীদারি অ্যাকাউন্টগুলি অডিট করুন',
    'coordinate across precinct teams': 'বিভিন্ন থানার টিমের মধ্যে সমন্বয় করুন',
    'monitor local precinct registries': 'স্থানীয় থানার রেজিস্ট্রিগুলি পর্যবেক্ষণ করুন',
    'verify identification documents': 'পরিচয়পত্র যাচাই করুন',

    // Hotspot Locations & Risks
    'bengaluru majestic': 'বেঙ্গালুরু মেজেস্টিক',
    'kr market hub': 'কেআর মার্কেট হাব',
    'electronic city tech zone': 'ইলেক্ট্রনিক সিটি টেক জোন',
    'whitefield hub': 'হোয়াইটফিল্ড হাব',
    'electronic city': 'ইলেক্ট্রনিক সিটি',
    'central business district': 'সেন্ট্রাল বিজনেস ডিস্ট্রিক্ট',
    'offshore node traces': 'অফশোর নোডের চিহ্ন',
    'bengaluru outer ring': 'বেঙ্গালুরু আউটার রিং',
    'mysuru highway': 'মহীশূর হাইওয়ে',
    'mysuru junction': 'মহীশূর জংশন',
    'hubli junction': 'হুবলি জংশন',
    'high': 'উচ্চ',
    'medium': 'মাঝারি',
    'low': 'কম',

    // Network Node Labels & Relations
    'co-accused ↕': 'সহ-অভিযুক্ত ↕',
    'suspect c (phisher)': 'সন্দেহভাজন সি (ফিশার)',
    'wire transfer ↕': 'অর্থ স্থানান্তর ↕',
    'mule account group': 'মিউল অ্যাকাউন্ট গ্রুপ',
    'call log ↕': 'কল লগ ↕',
    'offshore node x': 'অফশোর নোড এক্স',
    'upi spoof server': 'ইউপিআই স্পুফ সার্ভার',
    'hosted domain ↕': 'হোস্টেড ডোমেন ↕',
    'suspect c': 'সন্দেহভাজন সি',
    'recruiter ↕': 'নিয়োগকারী ↕',
    'sender account': 'প্রেরক অ্যাকাউন্ট',
    'mule account a': 'মিউল অ্যাকাউন্ট এ',
    'atm cashout ↕': 'এটিএম ক্যাশআউট ↕',
    'suspect node x': 'সন্দেহভাজন নোড এক্স',
    'suspect a': 'সন্দেহভাজন এ',
    'suspect b': 'সন্দেহভাজন বি',
    'asset dump ↕': 'সম্পত্তি ডাম্প ↕',
    'unknown node': 'অপরিচিত নোড',
    'indirect link ↕': 'পরোক্ষ সংযোগ ↕',
    'query subject': 'জিজ্ঞাসাবাদাধীন বিষয়',
    'associate ↕': 'সহযোগী ↕',

    // Historical Cases
    'kr market theft case #809': 'কেআর মার্কেট চুরি মামলা #৮০৯',
    'upi phishing scam #101': 'ইউপিআই ফিশিং স্ক্যাম #১০১',
    'bank spoofing investigation #202': 'ব্যাঙ্ক স্পুফিং তদন্ত #২০২',
    'upi scam #305': 'ইউপিআই স্ক্যাম #৩০৫',
    'layering scheme #302': 'লেয়ারিং স্কিম #৩০২',
    'mule network investigation #909': 'মিউল নেটওয়ার্ক তদন্ত #৯০৯',
    'burglary syndicate ring #110': 'সিঁধেল চুরি চক্র #১১০',
    'mysuru handbag snatching #402': 'মহীশূর হ্যান্ডব্যাগ ছিনতাই #৪০২',
    'general investigation #404': 'সাধারণ তদন্ত #৪০৪',

    // Action Chips
    'show linked suspects': 'সংযুক্ত সন্দেহভাজনদের দেখাও',
    'view crime locations': 'অপরাধের স্থানগুলি দেখুন',
    'check previous firs': 'পূর্ববর্তী এফআইআরগুলি পরীক্ষা করুন',
    'generate report': 'রিপোর্ট তৈরি করুন',
    'view related cases': 'সম্পর্কিত মামলাগুলি দেখুন',
    'analyze risk score': 'ঝুঁকির স্কোর বিশ্লেষণ করুন',
    '✓ show linked suspects': '✓ সংযুক্ত সন্দেহভাজনদের দেখাও',
    '✓ view crime locations': '✓ অপরাধের স্থানগুলি দেখুন',
    '✓ check previous firs': '✓ পূর্ববর্তী এফআইআরগুলি পরীক্ষা করুন',
    '✓ generate report': '✓ রিপোর্ট তৈরি করুন',
    '✓ freeze beneficiary accounts': '✓ সুবিধাভোগী অ্যাকাউন্টগুলি ফ্রিজ করুন',
    '✓ view related cases': '✓ সম্পর্কিত মামলাগুলি দেখুন',
    '✓ analyze risk score': '✓ ঝুঁকির স্কোর বিশ্লেষণ করুন',

    // Default Hotspot Locations
    'bengaluru urban': 'বেঙ্গালুরু নগর',
    'mysuru': 'মহীশূর',
    'hubli': 'হুবলি',

    // Timeline Milestone Events
    'fir registered': 'এফআইআর নথিভুক্ত করা হয়েছে',
    'case recorded in precinct file.': 'মামলাটি থানার ফাইলে নথিভুক্ত করা হয়েছে।',
    'suspect cross-referenced': 'সন্দেহভাজনকে ক্রস-রেফারেন্স করা হয়েছে',
    'identified offender records in database.': 'ডেটাবেসে অপরাধীর রেকর্ড সনাক্ত করা হয়েছে।',
    'prior convictions fetched': 'পূর্ববর্তী সাজার রেকর্ড সংগ্রহ করা হয়েছে',
    'retrieved 3 historical arrest reports.': '৩টি পূর্ববর্তী গ্রেপ্তারের রিপোর্ট সংগ্রহ করা হয়েছে।',
    'watchlist updated': 'নজরদারি তালিকা আপডেট করা হয়েছে',
    'placed suspect under active surveillance.': 'সন্দেহভাজনকে সক্রিয় নজরদারিতে রাখা হয়েছে।',
    'credential harvesting alert': 'তথ্য সংগ্রহের ফিশিং সতর্কতা',
    'victim reported credential phishing site.': 'ভুক্তভোগী ফিশিং সাইটের রিপোর্ট করেছেন।',
    'ip addresses decrypted': 'আইপি অ্যাড্রেস ডিক্রিপ্ট করা হয়েছে',
    'traced proxy originating headers.': 'প্রক্সি হেডার ট্র্যাক করা হয়েছে।',
    'accounts flagged': 'অ্যাকাউন্টগুলি ফ্ল্যাগ করা হয়েছে',
    'flagged 5 target transaction accounts.': '৫টি লক্ষ্যবস্তু লেনদেন অ্যাকাউন্ট ফ্ল্যাগ করা হয়েছে।',
    'assets frozen': 'সম্পত্তি বাজেয়াপ্ত করা হয়েছে',
    'secured court warrant to hold target assets.': 'লক্ষ্যবস্তু সম্পত্তি আটকে রাখার জন্য আদালতের পরোয়ানা সংগ্রহ করা হয়েছে।',
    'syndicate profile created': 'চক্রের প্রোফাইল তৈরি করা হয়েছে',
    'linked suspect phone exchanges mapped.': 'সংযুক্ত সন্দেহভাজনদের ফোন এক্সচেঞ্জ ম্যাপ করা হয়েছে।',
    'log subpoenas served': 'লগ সমন জারি করা হয়েছে',
    'call data records subpoenaed for 7 nodes.': '৭টি নোডের কল ডেটা রেকর্ডের সমন জারি করা হয়েছে।',
    'syndicate tree plotted': 'চক্রের সম্পর্ক রেখাচিত্র আঁকা হয়েছে',
    'linked suspect map registered in case file.': 'সংযুক্ত সন্দেহভাজনদের মানচিত্র মামলা ফাইলে নিবন্ধিত করা হয়েছে।',
    'warrants issued': 'পরোয়ানা জারি করা হয়েছে',
    'magistrate signed search and capture warrants.': 'ম্যাজিস্ট্রেট তল্লাশি এবং গ্রেপ্তারের পরোয়ানায় স্বাক্ষর করেছেন।',
    'clustered rates logged': 'একত্রিত অপরাধের হার নথিভুক্ত করা হয়েছে',
    'incident rates tracked in majestic bus stand.': 'মেজেস্টিক বাস স্ট্যান্ডে অপরাধের হার ট্র্যাক করা হয়েছে।',
    'patrol dispatch alert': 'টহল দল পাঠানোর সতর্কতা',
    'increased tactical sweeps dispatched to target areas.': 'লক্ষ্যবস্তু এলাকায় টহল বাড়ানো হয়েছে।',
    'hotspots model updated': 'হটস্পট মডেল আপডেট করা হয়েছে',
    'patrol map routes recalculated.': 'টহল রুট পুনর্নির্ধারণ করা হয়েছে।',
    'crime rates reduced': 'অপরাধের হার হ্রাস পেয়েছে',
    'local precinct reported 30% reduction in local thefts.': 'স্থানীয় থানা এলাকাটিতে চুরির ঘটনা ৩০% হ্রাসের কথা জানিয়েছে।'
  }
};

/**
 * Translates texts to/from target language using unified master dictionary.
 */
export const translateText = async (text, targetLang) => {
  // Simulate network request delay (80ms)
  await new Promise((resolve) => setTimeout(resolve, 80));

  if (!text || !targetLang) return text;

  // Handle reverse mapping lookup for translating query back to English
  if (targetLang === 'en') {
    let hasCheckmark = false;
    let cleanText = text.trim();
    if (cleanText.startsWith('✓')) {
      hasCheckmark = true;
      cleanText = cleanText.substring(1).trim();
    }

    const normalized = cleanText.toLowerCase().trim().replace(/[.?]/g, '');

    // Check if it is already an English key in the dictionary
    let foundEnglishKey = null;
    for (const lang of Object.keys(masterDictionary)) {
      if (masterDictionary[lang][normalized] !== undefined) {
        foundEnglishKey = normalized;
        break;
      }
    }

    if (!foundEnglishKey) {
      // Find English key by matching translated value in masterDictionary
      for (const lang of Object.keys(masterDictionary)) {
        for (const [engKey, transValue] of Object.entries(masterDictionary[lang])) {
          if (transValue && transValue.toLowerCase().trim().replace(/[.?]/g, '') === normalized) {
            foundEnglishKey = engKey;
            break;
          }
        }
        if (foundEnglishKey) break;
      }
    }

    if (foundEnglishKey) {
      return hasCheckmark ? `✓ ${foundEnglishKey}` : foundEnglishKey;
    }
    return text;
  }

  // Translating from English to targetLang
  let hasCheckmark = false;
  let cleanText = text.trim();
  if (cleanText.startsWith('✓')) {
    hasCheckmark = true;
    cleanText = cleanText.substring(1).trim();
  }

  const normalized = cleanText.toLowerCase().trim().replace(/[.?]/g, '');

  if (masterDictionary[targetLang] && masterDictionary[targetLang][normalized]) {
    const translated = masterDictionary[targetLang][normalized];
    return hasCheckmark ? `✓ ${translated}` : translated;
  }

  // Fallback to checking the checkmarked key directly in the dictionary if it exists
  const originalNormalized = text.toLowerCase().trim().replace(/[.?]/g, '');
  if (masterDictionary[targetLang] && masterDictionary[targetLang][originalNormalized]) {
    return masterDictionary[targetLang][originalNormalized];
  }

  // Document Analysis structure conversions (mocked descriptions)
  if (text.includes('Analysis complete for')) {
    if (targetLang === 'hi') return text.replace('Analysis complete for', 'दस्तावेज़ का विश्लेषण पूरा हुआ:').replace('. Here is the case summary generated by CrimeSphere AI.', '। यहाँ क्राइमस्फीयर एआई द्वारा उत्पन्न मामला सारांश है।');
    if (targetLang === 'kn') return text.replace('Analysis complete for', 'ದಾಖಲೆ ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ:').replace('. Here is the case summary generated by CrimeSphere AI.', '। ಇದು ಕ್ರೈಮ್‌ಸ್ಫಿಯರ್ ಎಐನಿಂದ ಸಿದ್ಧಪಡಿಸಲಾದ ಪ್ರಕರಣದ ಸಾರಾಂಶವಾಗಿದೆ.');
    if (targetLang === 'ta') return text.replace('Analysis complete for', 'வழக்கு ஆவண பகுப்பாய்வு முடிந்தது:').replace('. Here is the case summary generated by CrimeSphere AI.', '। இது கிரைம்ஸ்பியர் ஏஐ ஆல் உருவாக்கப்பட்ட வழக்கு சுருக்கம் ஆகும்.');
    if (targetLang === 'te') return text.replace('Analysis complete for', 'పత్ర విశ్లేషణ పూర్తయింది:').replace('. Here is the case summary generated by CrimeSphere AI.', '। ఇది క్రైమ్‌స్ఫియర్ AI ద్వారా సృష్టించబడిన కేసు సారాంశం.');
    if (targetLang === 'ml') return text.replace('Analysis complete for', 'രേഖ വിശകലനം പൂർത്തിയായി:').replace('. Here is the case summary generated by CrimeSphere AI.', '। ഇത് ക്രൈംസ്ഫിയർ എഐ തയ്യാറാക്കിയ കേസ് സംഗ്രഹമാണ്.');
    if (targetLang === 'bn') return text.replace('Analysis complete for', 'নথি বিশ্লেষণ সম্পূর্ণ হয়েছে:').replace('. Here is the case summary generated by CrimeSphere AI.', '। এখানে ক্রাইমস্ফিয়ার এআই দ্বারা তৈরি কেস সারসংক্ষেপ দেওয়া হল।');
  }

  return text;
};

/**
 * Translates verbal responses and intelligence summaries to target language.
 */
export const translateResponse = async (response, targetLanguage) => {
  return translateText(response, targetLanguage);
};

/**
 * Retrieves localized string for UI tokens.
 */
export const getTranslation = (key, lang = 'en') => {
  const selectedLang = lang === 'auto' ? 'en' : lang;
  return translations[selectedLang]?.[key] || translations['en']?.[key] || key;
};
