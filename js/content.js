/* All text on the site lives in this file, so you can edit it without touching the code.
   In text, {{key}} becomes a clickable citation; see SOURCES for the keys. */
(function () {
  var C = {
    peng: "#FF4FA3", migrant: "#5FE3F0", refuge: "#FFB347", sign: "#C3B5FF", malay: "#7EE8A2"
  };
  var P = {
    shanghai: [31.23, 121.47], hongkong: [22.3, 114.17], singapore: [1.29, 103.85],
    fujian: [24.7, 118.3], chaozhou: [23.4, 116.65], guangzhou: [23.13, 113.26], hainan: [19.6, 110.8],
    penang: [5.41, 100.33], malacca: [2.19, 102.25], johor: [1.75, 103.6], kl: [3.14, 101.69],
    washington: [38.91, -77.02]
  };

  var LEG1 = { from: P.shanghai, to: P.hongkong, color: C.peng, width: 3.2, bend: 0.14, dur: 2200, label: "1937 to school", labelDx: 10 };
  var LEG2 = { from: P.hongkong, to: P.shanghai, color: C.peng, width: 3.2, bend: 0.14, dur: 2200, dash: true, label: "1941 back, by cargo ship", labelDx: -10, labelAlign: "right" };
  var LEG3 = { from: P.shanghai, to: P.singapore, color: C.peng, width: 3.2, bend: 0.2, dur: 2800, label: "1948 to join his father", labelAt: 0.62, labelDx: 12 };
  function done(a) { return Object.assign({}, a, { done: true, label: null }); }
  var ROUTE = [done(LEG1), done(LEG2), done(LEG3)];

  var SOURCES = {
    tayng: { t: "Tay, P. & Ng, B. C. (2022). Revisiting the past to understand the present: The linguistic ecology of the Singapore deaf community and the historical evolution of SgSL. Frontiers in Communication, 6.", u: "https://doi.org/10.3389/fcomm.2021.748578" },
    podcast: { t: "Chew, N. Peng Tsu Ying: Singapore's pioneering Deaf educator. BiblioAsia podcast transcript, National Library Board.", u: "https://biblioasia.nlb.gov.sg/podcast/peng-tsu-ying-singapore-pioneering-deaf-educator-nathaniel-chew/transcript" },
    biblio: { t: "Liu, R. & Chew, N. (2025). Signs of progress: Deaf education in Singapore. BiblioAsia, 21(1).", u: "https://biblioasia.nlb.gov.sg/vol-21/issue-1/apr-jun-2025/deaf-education-singapore-sign-language/" },
    medium: { t: "Chew, N. (2024). Signs of the times: Early sign language and Deaf education in Singapore. National Library Blog.", u: "https://medium.com/the-national-library-blog/signs-of-the-times-early-sign-language-and-deaf-education-in-singapore-cb98e6e0f35f" },
    lin: { t: "Lin, H. (2021). Early development of Chinese Sign Language in Shanghai schools for the deaf. Frontiers in Psychology, 12, 702620.", u: "https://doi.org/10.3389/fpsyg.2021.702620" },
    sze: { t: "Sze, F., Lo, C., Lo, L. & Chu, K. (2013). Historical development of Hong Kong Sign Language. Sign Language Studies, 13(2), 155–185. Abstract consulted.", u: "https://cnlse.es/es/recursos/biblioteca/historical-development-hong-kong-sign-language" },
    roots: { t: "National Heritage Board. Beyond the Bund: How the Shanghainese community shaped colonial Singapore. Roots.gov.sg.", u: "https://www.roots.gov.sg/muse/articles/shanghainese-community-in-singapore" },
    teo: { t: "Teo, J. (2010). Chinese dialect groups and their occupations in 19th- and early 20th-century Singapore. BiblioAsia, 6(1).", u: "https://biblioasia.nlb.gov.sg/vol-6/issue-1/apr-2010/singapore-chinese-dialect-occupation/" },
    census: { t: "Chinese Singaporeans. Wikipedia, table of Singapore census counts by dialect group, 1990–2020. Check against the Department of Statistics before formal citation.", u: "https://en.wikipedia.org/wiki/Chinese_Singaporeans" },
    mpi: { t: "Yeoh, B. S. A. Singapore: Hungry for foreign workers at all skill levels. Migration Policy Institute.", u: "https://www.migrationpolicy.org/article/singapore-hungry-foreign-workers-all-skill-levels" },
    hsu: { t: "Report on Hsu's research on decolonization and migration in Singapore. The Johns Hopkins News-Letter (2024).", u: "https://www.jhunewsletter.com/article/2024/02/hsu-presents-research-on-decolonization-and-migration-in-singapore" },
    scmp: { t: "Forgotten stories of the great escape to Hong Kong across the Shenzhen border. South China Morning Post. A journalist's and author's estimate.", u: "https://scmp.com/news/china/article/1126786/forgotten-stories-huge-escape-hong-kong" },
    hkshanghai: { t: "Shanghainese people in Hong Kong. Wikipedia, citing the 1961 census.", u: "https://en.wikipedia.org/wiki/Shanghainese_people_in_Hong_Kong" },
    lim: { t: "Lim, L. (2007). Mergers and acquisitions: On the ages and origins of Singapore English particles. World Englishes, 26(4), 446–473. Abstract consulted.", u: "https://hub.hku.hk/handle/10722/177594" },
    apics: { t: "Khin Khin Aye. Singapore Bazaar Malay. Atlas of Pidgin and Creole Language Structures Online.", u: "https://apics-online.info/surveys/67" },
    oed2016: { t: "New Singaporean and Hong Kong terms in the OED. Language Log (2016).", u: "https://languagelog.ldc.upenn.edu/nll/?p=25672" },
    oed2025: { t: "From 'alamak' to 'nasi lemak': Oxford English Dictionary welcomes Malaysian and Singaporean words. Asia News Network (2025).", u: "https://asianews.network/?p=195587" },
    tapau: { t: "Where the word 'tapau' comes from. SAYS, summarizing the OED entry.", u: "https://says.com/my/lifestyle/why-do-malaysians-call-takeaway-tapau" },
    smc: { t: "The Speak Mandarin Campaign. Singapore Chinese Cultural Centre, Culturepaedia.", u: "https://culturepaedia.singaporeccc.org.sg/language-education/the-speak-mandarin-campaign/" },
    tv2: { t: "TV2 (Malaysian TV network). Wikipedia.", u: "https://en.wikipedia.org/wiki/TV2_(Malaysian_TV_network)" },
    cheongsam: { t: "Cheongsam. Singapore Infopedia, National Library Board.", u: "https://eresources.nlb.gov.sg/infopedia/articles/SIP_2013-09-27_171732.html" },
    mind: { t: "Learning Malaysian Sign Language (BIM). MIND. A community article.", u: "https://mind.org.my/article/learning-malaysian-sign-languagebim/" },
    penang: { t: "Penang Sign Language. Wikipedia.", u: "https://en.wikipedia.org/wiki/Penang_Sign_Language" },
    lee: { t: "Lee, N. E. (2016). An etymological study of Singapore Sign Language: The influence of ASL on SgSL. Undergraduate thesis, Nanyang Technological University.", u: "https://bond-lab.github.io/pdf/2016-fyp-lee-naomi-elizabeth.pdf" },
    ang: { t: "Ang, M. S. Y. (2017). Negation in Singapore Sign Language. Master's thesis, Nanyang Technological University. Abstract consulted.", u: "http://hdl.handle.net/10356/69940" },
    mak: { t: "Mak, J., Low, M. and colleagues. Conference abstracts and poster on the strata of SgSL basic vocabulary. Year and full authorship not verified; not peer reviewed.", u: "https://independent.academia.edu/MakJessica" },
    so2010: { t: "So, W. C. (2010). Cross-cultural transfer in gesture frequency in Chinese–English bilinguals. Language and Cognitive Processes, 25(10), 1335–1353. Read through a later paper's summary.", u: "https://escholarship.org/content/qt6tp989dh/qt6tp989dh.pdf" },
    so2013: { t: "So, W. C., Kita, S. & Goldin-Meadow, S. (2013). When do speakers use gestures to specify who does what to whom? Journal of Psycholinguistic Research, 42(6), 581–594.", u: "https://doi.org/10.1007/s10936-012-9230-6" },
    so2014: { t: "So, W.-C., Lim, J.-Y. & Tan, S.-H. (2014). Sensitivity to information status in discourse: Gesture precedes speech in unbalanced bilinguals. Applied Psycholinguistics, 35(1). Abstract consulted.", u: "https://core-prod.cambridgecore.org/core/journals/applied-psycholinguistics/article/sensitivity-to-information-status-in-discourse-gesture-precedes-speech-in-unbalanced-bilinguals/D405B10E2A89AA3848E0496609C700D6" },
    solim: { t: "So, W. C. & Lim, J. Y. (2012). Point to a referent, and say, 'what is this?' Applied Psycholinguistics, 33(2), 329–342. Abstract consulted.", u: "https://doi.org/10.1017/S0142716411000373" },
    malaypoint: { t: "Study of pointing gestures among Malay speakers in direction giving. Gesture, 16(1). Abstract consulted.", u: "https://www.jbe-platform.com/content/journals/10.1075/gest.16.1.03mec" },
    ntu: { t: "Singapore Sign Language. NTU Centre for Modern Languages.", u: "https://ntu.edu.sg/cml/languages/singapore-sign-language" },
    signbank: { t: "SgSL Sign Bank: home, history and language parameters. NTU and the Singapore Association for the Deaf.", u: "https://blogs.ntu.edu.sg/sgslsignbank" },
    hey: { t: "Rodriguez, D. (2025). Signed, sealed and delivered. HEY!, Nanyang Technological University.", u: "https://www.ntu.edu.sg/hey/search-stories/detail/signed-sealed-and-delivered" },
    msf: { t: "Ministry of Social and Family Development (27 February 2025). Review of SgSL as an official language.", u: "https://www.msf.gov.sg/media-room/article/review-of-sgsl-as-an-official-language-and-funding-support-for-sgsl-interpreter-services" },
    tayposter: { t: "Tay, P. (2019). Poster on language ideologies in the Singapore Deaf community, TISLR 13.", u: "https://www.idgs.uni-hamburg.de/forschung/tagungen/tislr2019/programm/poster-tay.pdf" },
    scmpdialect: { t: "Language barrier. South China Morning Post, on Singapore's dialect broadcast restrictions.", u: "https://www.scmp.com/article/408852/language-barrier" }
  };

  var PLACES = {
    shanghai: {
      name: "Shanghai", ll: P.shanghai, side: "right",
      spoken: "<p>A treaty port from 1843 that drew migrants from neighboring provinces. Overseas, “Shanghainese” was a loose label: customs officials applied it to anyone leaving through the port, and the group in Singapore calls itself Sanjiangren, from Zhejiang, Jiangsu and Jiangxi.{{roots}}</p><p>I found no documented Shanghainese words in Singlish. The strongest trace is a garment: the dress became fashionable in late-1920s Shanghai and is <i>zansae</i> in Shanghainese, <i>qipao</i> in Mandarin and <i>cheongsam</i> in Cantonese.{{cheongsam}}{{hkshanghai}}</p>",
      sign: "<p>Shanghai's Deaf schools produced the sign language Peng carried south. Lin documents two signs for the city itself: SHANGHAI-1, two hands with hooked little fingers, and SHANGHAI-2, one hand with a shaking index finger.{{lin}}</p><p>WATER used a shaking W-shaped hand, likely borrowed from a fingerspelled form resembling the American manual W.{{lin}}</p>",
      gesture: "<p>I found no study of Shanghainese speakers' gestures that connects to Singapore. Teachers at the Zhonghua school taught mainly through signing, supported by pictures and writing, and dropped speech training.{{lin}}</p>"
    },
    hongkong: {
      name: "Hong Kong", ll: P.hongkong, side: "left",
      spoken: "<p>Cantonese gave Singapore English a later layer of particles: <b>lor, hor, leh, meh, ma</b>, including their tones.{{lim}} Food words followed too: <b>char siu</b> and <b>yum cha</b> are now in the OED.{{oed2016}}</p><p>Hong Kong had its own Shanghai story: about 70,000 Shanghainese speakers in 1961, 2.6% of those aged five and over.{{hkshanghai}}</p>",
      sign: "<p>Peng attended the Zhenduo school here from 1937 to 1941. It was an oral school that still allowed signing.{{lin}}{{tayng}}</p><p>A Deaf couple carrying Nanjing and Shanghai signs founded Hong Kong's first signing school in 1948–49. Modern Hong Kong Sign Language is a mixture of those signs and earlier local signing.{{sze}} Peng's wife and fellow teacher, Ho Mei Soo, was a Deaf teacher from Hong Kong.{{medium}}</p>",
      gesture: "<p>I found no gesture study linking Hong Kong to Singapore directly. Wing Chee So, the main researcher on Singaporean bilingual gesture, later worked in Hong Kong.{{so2014}}</p>"
    },
    singapore: {
      name: "Singapore", ll: P.singapore, side: "right",
      spoken: "<p>Singlish layers English with Malay, Hokkien, Cantonese, Mandarin and Tamil.{{tayng}} State policy then reorganized the mix: from 1980 to 1989, Primary One pupils from mainly dialect-speaking homes fell from 64% to 7%.{{smc}}</p>",
      sign: "<p>SgSL is an amalgamation of SSL, ASL, manually coded English and local signs.{{ntu}} NTU estimates about 5,000 self-identified sign language users.{{ntu}} Scroll past the globe for each layer and its examples.</p>",
      gesture: "<p>English–Mandarin bilinguals in Singapore gesture more in Mandarin than Mandarin monolinguals do.{{so2010}} Proficiency also changes how pointing and iconic gestures relate to speech.{{so2013}}</p>"
    },
    fujian: {
      name: "Quanzhou and Zhangzhou, Fujian", ll: P.fujian, side: "right",
      spoken: "<p>Home of the Hokkien, Singapore's largest Chinese group.{{teo}} With Bazaar Malay, Hokkien contributed the particles <b>lah, ah, what</b>.{{lim}} Words include <b>ang moh</b>, a term for Westerners, and <b>kaypoh</b>, busybody.{{oed2016}}{{tayng}}</p><p>Hokkien also shaped Bazaar Malay itself as its major substrate.{{apics}}</p>",
      sign: "<p>Hokkien reaches SgSL through Singlish. KAYPOH is fingerspelled with the letters K and P.{{medium}}</p>",
      gesture: "<p>I found no study of Hokkien-specific gestures in Singapore.</p>"
    },
    chaozhou: {
      name: "Chaozhou, Guangdong", ll: P.chaozhou, side: "right",
      spoken: "<p>Home of the Teochew, the second-largest group. In the 1840s they made up over 95% of Chinese gambier and pepper planters and coolies in Singapore.{{teo}} I did not find a Singlish word list traced specifically to Teochew.</p>",
      sign: "<p>No direct sign language link found.</p>",
      gesture: "<p>No study found.</p>"
    },
    guangzhou: {
      name: "Guangzhou and the Pearl River Delta", ll: P.guangzhou, side: "left",
      spoken: "<p>Cantonese migrants left mainly through Macau before Hong Kong opened in 1842.{{teo}} <b>Tapau</b>, to pack food to go, is generally traced to Cantonese <i>daa baau</i> 打包, and the OED lists it through Malay.{{tapau}} <b>Cheongsam</b> is a Cantonese name: “long dress.”{{cheongsam}}</p>",
      sign: "<p>No direct link found. Hong Kong is the nearer signing story.</p>",
      gesture: "<p>No study found.</p>"
    },
    hainan: {
      name: "Hainan", ll: P.hainan, side: "left",
      spoken: "<p>Hainanese migration came late, after 1870. The community was known for coffee stalls, baking and domestic service.{{teo}}</p>",
      sign: "<p>No direct link found.</p>", gesture: "<p>No study found.</p>"
    },
    penang: {
      name: "Penang", ll: P.penang, side: "right",
      spoken: "<p>Part of the same migration world: Singapore's Malay population includes immigrants from Penang, Malacca and Johor.{{apics}}</p>",
      sign: "<p>The Federation School for the Deaf opened here in 1954, the same year as Peng's school. Classes were oral, but students signed in the dormitory at night. That signing became Penang Sign Language.{{penang}}{{mind}}</p>",
      gesture: "<p>No Penang-specific study found.</p>"
    },
    malacca: {
      name: "Malacca", ll: P.malacca, side: "right",
      spoken: "<p>A trading center where a Malay trade language spread before 1511.{{apics}} Singapore's first Hokkien arrivals came from Malacca.{{teo}}</p>",
      sign: "<p>No direct link found.</p>",
      gesture: "<p>A separate study of Malay speakers giving directions found pointing that combines hand forms with gaze, torso and head, some of it specific to Malay speakers.{{malaypoint}}</p>"
    },
    johor: {
      name: "Johor", ll: P.johor, side: "left",
      spoken: "<p>Directly across the strait. Johor is among the origins of Singapore's Malay immigrants.{{apics}}</p>",
      sign: "<p>In the early 1960s, Johor pharmacist Tan Yap went to America to study sign language and returned to teach Deaf children. BIM grew from this ASL base.{{mind}}{{penang}}</p>",
      gesture: "<p>No Johor-specific study found.</p>"
    },
    washington: {
      name: "Washington, DC", ll: P.washington, side: "left",
      spoken: "<p>The English side of the story: SEE-II was built to make English grammar visible on the hands.{{tayng}}</p>",
      sign: "<p>Lim Chin Heng studied at Gallaudet College here, and took a SEE-II course during his graduate studies. Frances Parsons, a Deaf Gallaudet professor, then toured the world promoting Total Communication, reaching Singapore in 1976.{{tayng}} Malaysia's Tan Yap also studied at Gallaudet, according to one account.{{penang}}</p>",
      gesture: "<p>Parsons contrasted “structural signed language” with “natural gestures” she said had no grammar. Linguists now treat natural sign languages as full languages.{{tayng}}{{ntu}}</p>"
    }
  };

  var WORDS_SPOKEN = [
    { w: "lah, ah, what", o: "Bazaar Malay and Hokkien", g: "Discourse particles from the early era", c: "lim" },
    { w: "lor, hor, leh, meh, ma", o: "Cantonese", g: "Particles from a later era, tone included", c: "lim" },
    { w: "kaypoh", o: "Chinese origin", g: "Busybody", c: "tayng" },
    { w: "ang moh", o: "Hokkien", g: "“Red hair,” a term for Westerners", c: "oed2016" },
    { w: "char siu, yum cha", o: "Cantonese", g: "Roast pork; going out for dim sum", c: "oed2016" },
    { w: "tapau", o: "Cantonese, via Malay", g: "To pack food to go", c: "tapau" },
    { w: "alamak", o: "Malay", g: "“Oh my God!” OED evidence from 1952", c: "oed2025" },
    { w: "cheongsam", o: "Cantonese", g: "“Long dress,” a Shanghai fashion", c: "cheongsam" }
  ];

  var CHAPTERS = [
    {
      id: "intro", year: 1926, rail: "Start", label: "Three ports",
      title: "Three Ports, One Sign Language",
      byline: "By Tiffany He",
      cam: { lat: 18, lon: 112, z: 1 },
      arcs: [LEG1, Object.assign({}, LEG2, { delay: 1800 }), Object.assign({}, LEG3, { delay: 3600 })].map(function (a) { return Object.assign({}, a, { label: null }); }),
      pins: ["shanghai", "hongkong", "singapore"],
      body: [
        "Peng Tsu Ying was born in Shanghai in 1926 and lost his hearing at about five. He studied in Hong Kong, returned to Shanghai during the war, and reached Singapore around 1948.{{podcast}}",
        "In 1954 he opened Singapore's first school for the Deaf, teaching in Shanghainese Sign Language. Later layers built on that start to form Singapore Sign Language (SgSL).{{tayng}}",
        "His route is a miniature, not a template. It opens onto bigger stories of migration, spoken language and signing."
      ]
    },
    {
      id: "shanghai", year: 1926, rail: "1926", label: "Shanghai",
      when: "1926–1937", title: "A Deaf child in a city of migrants",
      cam: { lat: 30, lon: 120, z: 5 }, arcs: [], pins: ["shanghai"],
      body: [
        "Shanghai had been a treaty port since 1843, and by 1943 about five million people lived there, many of them migrants from nearby provinces.{{roots}}",
        "Deaf education there went back to about 1892, and more schools opened from the 1920s. A distinct Shanghai signing variety emerged by the 1940s.{{lin}}"
      ]
    },
    {
      id: "hk", year: 1937, rail: "1937", label: "To Hong Kong",
      when: "1937–1941", title: "South to a Cantonese city",
      cam: { lat: 27, lon: 118, z: 3 }, arcs: [LEG1], pins: ["shanghai", "hongkong"],
      body: [
        "Peng's parents took him to Hong Kong's school for the Deaf, Zhenduo, where he studied from 1937 to 1941.{{lin}}{{podcast}} It taught orally but allowed signing in and out of class.{{tayng}}",
        "1937 is also when war drove Shanghainese south to Hong Kong.{{hkshanghai}} The sources tie Peng's own move to schooling, not to flight."
      ]
    },
    {
      id: "back", year: 1941, rail: "1941", label: "Back to Shanghai",
      when: "December 1941", title: "The route doubles back",
      cam: { lat: 27, lon: 118, z: 3 }, arcs: [done(LEG1), LEG2], pins: ["shanghai", "hongkong"],
      body: [
        "When Japan invaded Hong Kong, Peng returned to Shanghai on a Japanese cargo ship.{{tayng}} So the real route is Shanghai, Hong Kong, Shanghai, Singapore.",
        "He enrolled at the Zhonghua (Chung Wah) school, founded in 1937 by the Deaf educator He Yulin. Deaf teachers led it and signing was the main medium.{{lin}}",
        "This is where Peng's signing took shape: Shanghainese Sign Language and some ASL. He later taught there.{{podcast}}"
      ]
    },
    {
      id: "singapore", year: 1948, rail: "1948", label: "To Singapore",
      when: "1948", title: "A family reunion, and no Deaf people in sight",
      cam: { lat: 14, lon: 112, z: 2.2 }, arcs: [done(LEG1), done(LEG2), LEG3], pins: ["shanghai", "hongkong", "singapore"],
      body: [
        "At 21, Peng came to join his father, who ran a greeting card business. Employers turned him down because he was Deaf.{{biblio}}{{podcast}}",
        "“I couldn't find a single deaf person!” he recalled.{{biblio}} The education department told him no Deaf school existed.{{podcast}}",
        "He arrived as the door was narrowing. From October 1948 entry was limited to relatives of legal residents and some skilled workers.{{hsu}}"
      ]
    },
    {
      id: "who", year: 1948, rail: "Who came", label: "Who came",
      when: "1819–1950s", title: "Peng's route was not the main route",
      cam: { lat: 13, lon: 111, z: 2 },
      arcs: [
        { from: P.fujian, to: P.singapore, color: C.migrant, width: 5.5, bend: -0.1, dur: 1800, label: "Hokkien 39.3%", labelAt: 0.24, labelDx: 16 },
        { from: P.chaozhou, to: P.singapore, color: C.migrant, width: 3.6, bend: -0.04, dur: 1800, delay: 200, label: "Teochew 19.4%", labelAt: 0.42, labelDx: 12 },
        { from: P.guangzhou, to: P.singapore, color: C.migrant, width: 3, bend: 0.03, dur: 1800, delay: 400, label: "Cantonese 14.3%", labelAt: 0.34, labelDx: -10, labelAlign: "right" },
        { from: P.hainan, to: P.singapore, color: C.migrant, width: 1.9, bend: 0.12, dur: 1800, delay: 600, label: "Hainanese 6.1%", labelAt: 0.5, labelDx: -10, labelAlign: "right" },
        { from: P.shanghai, to: P.singapore, color: C.peng, width: 1.3, bend: -0.2, dur: 2200, delay: 800, label: "Sanjiang 0.75%", labelAt: 0.34, labelDx: 10 }
      ],
      pins: ["fujian", "chaozhou", "guangzhou", "hainan", "shanghai", "singapore"],
      legend: [[C.migrant, "Southern dialect groups"], [C.peng, "Via Shanghai"], [null, "Line width follows each group's share of Chinese residents, 2020 census"]],
      chart: "census",
      body: [
        "Most Chinese migrants to Singapore did not travel Shanghai to Hong Kong to Singapore. They came from Fujian and Guangdong, and Hokkien alone is nearly two in five Chinese Singaporeans.{{teo}}{{census}}",
        "The Shanghainese were first counted separately in 1957, at 11,034. By 2020 they were 22,503, or 0.75%.{{roots}}"
      ]
    },
    {
      id: "cr", year: 1966, rail: "1966–76", label: "Cultural Revolution",
      when: "1937–1979", title: "Why people fled, and where the Cultural Revolution fits",
      cam: { lat: 25.5, lon: 115, z: 3.3 },
      arcs: [
        { from: P.shanghai, to: P.hongkong, color: C.refuge, width: 2.4, bend: 0.14, dur: 2000, label: "1937–49: war, civil war", labelDx: 10 },
        { from: P.guangzhou, to: P.hongkong, color: C.refuge, width: 5, bend: -0.4, dur: 1400, delay: 800, alt: 0.012, label: "1957–79: great escape", labelDx: -12, labelDy: 24, labelAlign: "right" },
        done(LEG3)
      ],
      pins: ["shanghai", "hongkong", "guangzhou"],
      legend: [[C.refuge, "Flight to Hong Kong"], [C.peng, "Peng, 1948, already gone"]],
      body: [
        "The Cultural Revolution began in 1966, 18 years after Peng reached Singapore. It could not have moved him.",
        "It did drive people out, but mostly to Hong Kong. Illegal crossings peaked in 1957, 1962, 1972 and 1979, some by night swims across Dapeng and Shenzhen bays. One researcher estimates about two million over those decades.{{scmp}}",
        "Singapore was largely closed by then. A 1928 quota ended open immigration, and a 1953 ordinance curbed manual workers.{{mpi}} Emigration from Shanghai stayed low from the 1950s until the late 1970s.{{roots}}",
        "The earlier push from Shanghai to Hong Kong came from war in 1937 and civil war from 1946.{{hkshanghai}}"
      ]
    },
    {
      id: "spoken", year: 1966, rail: "Speech", label: "Spoken language",
      when: "1819 to today", title: "How the voices mixed into Singlish",
      cam: { lat: 13, lon: 110, z: 1.9 },
      arcs: [
        { from: P.fujian, to: P.singapore, color: C.migrant, width: 2.4, bend: -0.1, dur: 1500, label: "Hokkien: lah, ah, what", labelAt: 0.3 },
        { from: P.hongkong, to: P.singapore, color: C.refuge, width: 2.4, bend: 0.05, dur: 1500, delay: 300, label: "Cantonese: lor, hor, leh", labelAt: 0.3, labelDx: -10, labelAlign: "right" },
        { from: P.malacca, to: P.singapore, color: C.malay, width: 2.4, alt: 0.03, dur: 1200, delay: 600 }
      ],
      pins: ["fujian", "hongkong", "shanghai", "malacca", "singapore"],
      words: WORDS_SPOKEN,
      body: [
        "Lim (2007) sees layers. Bazaar Malay and Hokkien gave early particles; Cantonese later gave others, tones included.{{lim}}",
        "Then policy intervened. English became the first school language in 1966, the Speak Mandarin Campaign began in 1979, dialect TV was banned in 1981 and dialect radio ended in 1983.{{tayng}}{{smc}}",
        "Shanghainese left little in speech that I could document. Its route into Singapore's language runs through signing."
      ]
    },
    {
      id: "school", year: 1954, rail: "1954", label: "The first school",
      when: "1954", title: "Four students, then a school",
      cam: { lat: 12, lon: 112, z: 2.1 },
      arcs: [
        { from: P.shanghai, to: P.singapore, color: C.sign, width: 3.2, bend: 0.2, dur: 2200, label: "Shanghai signs, via Peng", labelAt: 0.62, labelDx: 12 },
        { from: P.shanghai, to: P.hongkong, color: C.sign, width: 2.2, bend: -0.14, dur: 1600, delay: 300, label: "1948–49: Deaf couple", labelDx: 10, labelAt: 0.4 },
        { from: P.hongkong, to: P.singapore, color: C.sign, width: 1.6, bend: -0.12, dur: 1600, delay: 700, label: "Ho Mei Soo", labelDx: -10, labelAlign: "right" }
      ],
      pins: ["shanghai", "hongkong", "singapore"],
      body: [
        "Peng advertised in Chinese newspapers and taught four students at his parents' home. He raised over $3,000 door to door, with support from Chinese merchants.{{podcast}}{{biblio}}",
        "In 1954 the Singapore Chinese School for the Deaf opened on Charlton Road, teaching in SSL and written Chinese.{{tayng}}{{biblio}} Chinese influence entered through this institution.",
        "Shanghai and Hong Kong met in one classroom: Peng and his wife, Ho Mei Soo, a Deaf teacher from Hong Kong.{{medium}} In 1957 another Deaf man from Shanghai, Joseph Koo, opened an art school teaching Chinese writing and SSL.{{tayng}}"
      ]
    },
    {
      id: "shift", year: 1975, rail: "1975–78", label: "The American turn",
      when: "1975–1978", title: "A second route, across the Pacific",
      cam: { lat: 30, lon: -178, z: 0.84 },
      arcs: [
        { from: P.singapore, to: P.washington, color: C.sign, width: 3, alt: 0.05, dur: 3000, bend: 0.02, label: "Lim Chin Heng to Gallaudet", labelAt: 0.5, labelDy: 16, labelDx: -40 },
        { from: P.washington, to: P.singapore, color: C.refuge, width: 3, alt: 0.11, dur: 3000, delay: 1000, bend: 0.02, label: "ASL, SEE-II, Total Communication", labelAt: 0.5, labelDy: -14, labelDx: -60 }
      ],
      pins: ["singapore", "washington"],
      legend: [[C.sign, "Going to study"], [C.refuge, "Ideas coming back"]],
      body: [
        "Lim Chin Heng, Peng's former student, studied at Gallaudet and in 1975 brought back ASL, SEE-II and Total Communication.{{tayng}}",
        "In 1976 Frances Parsons came to train teachers. She contrasted SSL's “unstructured” signs with SEE-II's “structured” ones. Peng himself then decided to drop SSL.{{tayng}}",
        "The Chinese sign section was phased out by 1978, in line with English-based bilingualism. Older signers still use SSL privately, but feel embarrassed to use it in the wider community.{{tayng}}"
      ]
    },
    {
      id: "gesture", year: 1990, rail: "Gesture", label: "Gesture",
      when: "Research, 2010–2014", title: "Gesture: what hearing hands show",
      cam: { lat: 6, lon: 108, z: 3 },
      arcs: [],
      pins: ["singapore", "malacca"],
      chart: "matrix",
      body: [
        "Most Singapore gesture research studies hearing English–Mandarin bilinguals. So (2010) found they gesture more in Mandarin than Mandarin monolinguals do, which suggests gesture habits transfer between languages.{{so2010}}",
        "So, Lim and Tan (2014) found English-dominant children's gestures tracked new information in Mandarin even when their speech did not.{{so2014}}",
        "I found no peer-reviewed evidence of gestures passing from Shanghainese or Cantonese speakers into SgSL. That study has yet to be done, and it is the open question here."
      ]
    },
    {
      id: "malaysia", year: 1963, rail: "Malaysia", label: "Malaysia",
      when: "1954 to today", title: "Malaysia and Singapore, sharing a strait",
      cam: { lat: 3.1, lon: 102.2, z: 6.5 },
      arcs: [
        { from: P.malacca, to: P.singapore, color: C.malay, width: 2.8, alt: 0.008, dur: 1400, label: "Bazaar Malay", labelDx: -12, labelDy: 12, labelAlign: "right", labelAt: 0.5 },
        { from: P.singapore, to: P.penang, color: C.sign, width: 2.4, alt: 0.012, bend: 0.12, dur: 1800, delay: 300, dash: true, label: "Same year: 1954", labelAt: 0.7, labelDx: -10, labelAlign: "right" }
      ],
      pins: ["penang", "malacca", "johor", "singapore"],
      legend: [[C.malay, "Spoken link"], [C.sign, "Parallel Deaf schools"]],
      words: [
        { w: "Speech, shared", o: "Both countries", g: "alamak, tapau, otak-otak and ketupat, all in the OED's 2025 update", c: "oed2025" },
        { w: "Bazaar Malay", o: "From Malacca's trade", g: "Lingua franca, with Hokkien as its main substrate", c: "apics" },
        { w: "Dialect media", o: "Opposite policies", g: "Singapore banned dialect TV in 1981; Malaysia's TV2 began Cantonese and Hokkien dramas in 1984", c: "tv2" },
        { w: "Peng in Malaya", o: "1951 and 1965", g: "Appealed for “the deaf in Malaya”; third in the 1965 Malaysian Grand Prix, his brother signing race positions", c: "podcast" },
        { w: "Parsons, 1976", o: "Both countries", g: "One visitor pushed Total Communication in both", c: "penang" },
        { w: "Students", o: "To SSD and back", g: "About 10 Deaf Malaysians studied at SSD, then went home", c: "tayng" },
        { w: "Shared signs", o: "SgSL and BIM", g: "Some forms unique to SgSL are shared only with BIM", c: "mak" }
      ],
      body: [
        "Singapore was part of Malaysia from 1963 to 1965, but the ties run deeper. Malay was the old trade language, and Singapore's Malay community includes people from Penang, Malacca and Johor.{{apics}}",
        "Influence runs both ways. Deaf Malaysians studied in Singapore, while Malaysia has had regular sign interpreters on TV news since 1986, and Singapore's remain occasional.{{tayng}}",
        "The sign histories also rhyme. Penang's Deaf school opened in 1954 too, and Johor's Tan Yap brought ASL in the 1960s.{{penang}}{{mind}}"
      ]
    },
    {
      id: "today", year: 2019, rail: "Today", label: "Today",
      when: "2018 to today", title: "What the route left behind",
      cam: { lat: 16, lon: 112, z: 1.5 }, arcs: ROUTE, pins: ["shanghai", "hongkong", "singapore"],
      next: true,
      body: [
        "Peng died on 24 October 2018, at 92, and received the Public Service Medal posthumously in 2019.{{biblio}}",
        "The Sign Bank launched that year. As of February 2025, the government's study of official recognition for SgSL was still underway.{{biblio}}{{msf}}",
        "SgSL may also be fading. Younger Deaf people mostly grow up oral, and Tay and Ng call the language endangered.{{tayng}}",
        "So what did all these routes add up to?"
      ]
    }
  ];

  var POLICY = [
    { y: 1928, t: "1928 quota ends open immigration", c: "mpi" },
    { y: 1953, t: "1953 ordinance curbs manual workers", c: "mpi" },
    { y: 1966, t: "1966 English–mother tongue bilingual policy", c: "tayng" },
    { y: 1979, t: "1979 Speak Mandarin Campaign", c: "smc" },
    { y: 1981, t: "1981 dialect TV banned", c: "smc" },
    { y: 2000, t: "2000 Speak Good English Movement", c: "tayng" }
  ];

  var LAYERS = [
    {
      id: "ssl", name: "Shanghainese Sign Language", short: "SSL", era: "From 1954", tone: "#F3D9E6",
      how: "Peng's teaching language. The older layer of SgSL's basic vocabulary.{{mak}}{{tayng}}",
      groups: [
        { h: "Signs documented in Shanghai", items: ["SHANGHAI-1", "SHANGHAI-2", "WATER (W hand)", "XUJIAHUI, same sign as JESUS"], c: "lin" },
        { h: "Where it lives now", items: ["Private use among older signers"], c: "tayng" }
      ],
      note: "These examples are documented in Shanghai. The sources I read don't list specific SgSL signs traced to SSL, and the Sign Bank gives no etymologies. This is the biggest gap in the picture."
    },
    {
      id: "asl", name: "American Sign Language", short: "ASL", era: "From 1975", tone: "#DADCF3",
      how: "Brought back from Gallaudet by Lim Chin Heng. The newer layer, reaching even core vocabulary.{{tayng}}{{mak}}",
      groups: [
        { h: "Judged the same as ASL by all 10 raters, with identical transcription", items: ["DIE", "CORRECT", "SALT", "WATER", "WHERE", "WIDE", "WIFE", "YEAR"], c: "lee" },
        { h: "All five colors had an ASL-like sign", items: ["BLACK", "GREEN", "RED", "WHITE", "YELLOW"], c: "lee" },
        { h: "Grammar: 7 of 13 manual negative forms resemble ASL", items: ["Yet SgSL still prefers manual negation, unlike ASL"], c: "ang" }
      ],
      note: "“Like ASL” does not always mean “from ASL.” Shanghai's WATER already used a W hand, so a sign can look American and still have come through Shanghai. That link is my inference, and it needs testing."
    },
    {
      id: "see", name: "Signing Exact English II", short: "SEE-II", era: "From 1976", tone: "#D6E9EC",
      how: "A manual code for English, not a natural language. Teaching medium at the School for the Deaf from the late 1970s.{{tayng}}",
      groups: [
        { h: "Every word gets a sign", items: ["articles", "determiners", "auxiliary verbs", "conjunctions"], c: "tayng" },
        { h: "Word endings made visible", items: ["REACH + -ed", "NICE + -ly", "BUTTERFLY as one ASL sign"], c: "tayng" },
        { h: "Formal use", items: ["The National Pledge, one sign per word"], c: "medium" }
      ],
      note: "SEE stands where Standard English stands: “proper,” used in school and formal settings. Some signers still prefer it, as the evidence below shows."
    },
    {
      id: "local", name: "Locally created signs", short: "Local", era: "Since the 1950s", tone: "#F4E8BE",
      how: "Signs for things found only here. Some may come from students at Peng's school or from Deaf families.{{mak}}{{tayng}}",
      groups: [
        { h: "Food", items: ["durian", "rojak", "satay", "kueh lapis"], c: ["tayng", "hey"] },
        { h: "Places", items: ["Orchard Road", "Raffles", "Tiong Bahru", "Boon Lay", "Bedok", "Chinatown", "Changi Airport"], c: ["tayng", "hey", "biblio", "signbank"] },
        { h: "Life and culture", items: ["cheongsam", "Deepavali", "MRT"], c: ["tayng", "biblio"] },
        { h: "Shaped like the thing", items: ["MARINA BAY SANDS: three fingers up, an index finger laid across the top"], c: "medium" }
      ],
      note: "The Marina Bay Sands sign draws the building with the hands. It shows how close signs and gesture can sit, without being the same thing."
    },
    {
      id: "singlish", name: "Singlish and fingerspelled loans", short: "Singlish", era: "Ongoing", tone: "#E2EAD0",
      how: "Spoken Singapore enters SgSL through words and through the manual alphabet.{{tayng}}",
      groups: [
        { h: "Words from speech", items: ["kaypoh", "alamak"], c: "tayng" },
        { h: "Built from letters", items: ["KAYPOH: K then P", "BOON LAY: B then L, hands moving left to right"], c: "medium" }
      ],
      note: "KAYPOH compresses the whole story: a Chinese-origin word in Singlish, written in Roman letters, spelled on the hand."
    },
    {
      id: "bim", name: "Forms shared with Malaysia", short: "BIM", era: "Date unclear", tone: "#F2E0CF",
      how: "Some forms unique to SgSL are shared only with Malaysian Sign Language. It is unclear whether they predate SSL.{{mak}}",
      groups: [
        { h: "Possible channels", items: ["About 10 Deaf Malaysians studied at SSD", "Deaf families", "A shared ASL influence after 1976"], c: "tayng" }
      ],
      note: "I could not find a published list of these signs. The ASL channel is a shared influence, not direct borrowing, and is listed here as a possibility."
    }
  ];


  /* Timeline events. lane: "society" sits above the line, "deaf" below.
     lv: label height, 0 is closest to the line. anchor: "end" puts the label left of its marker. */
  var TIMELINE = [
    { y: 1926, lane: "deaf", lv: 0, label: "Peng is born", title: "Peng Tsu Ying is born in Shanghai", ch: "shanghai",
      body: "Peng was born in Shanghai in 1926 and lost his hearing at about five.{{podcast}} The city was already a magnet for migrants, and its Deaf schools were multiplying.{{lin}}",
      why: "His childhood puts him in the place where a distinct Shanghai signing variety was forming." },
    { y: 1928, lane: "society", lv: 0, label: "Quota", title: "Singapore's open door starts to close", ch: "who",
      body: "The Immigration Restriction Ordinance ended about a century of open immigration. It set a monthly quota on Chinese men, tied to slumps in rubber and tin, and in 1932 the quota widened to all non-British immigrants.{{mpi}} Women and children were left out of the early limits, so many Chinese women arrived in the mid-1930s.{{mpi}}",
      why: "More families and fewer new male laborers could change how dialects were passed on, at home instead of through constant new arrivals." },
    { y: 1937, lane: "society", lv: 0, label: "War in Shanghai", title: "War pushes people south from Shanghai", ch: "cr",
      body: "The Second Sino-Japanese War began in 1937, and migration from Shanghai to British Hong Kong began with it. It grew again when civil war resumed in 1946.{{hkshanghai}}",
      why: "This is the real Shanghai to Hong Kong migration. By 1961, Hong Kong counted about 70,000 Shanghainese speakers, 2.6% of those aged five and over.{{hkshanghai}}" },
    { y: 1937, lane: "deaf", lv: 3, label: "Hong Kong school", title: "Peng goes to school in Hong Kong", ch: "hk",
      body: "Peng attended Hong Kong's Zhenduo school for the Deaf from 1937 to 1941.{{lin}} It taught orally but allowed signing in and out of class.{{tayng}}",
      why: "The sources connect this move to schooling, not to the war that began that year." },
    { y: 1941, lane: "deaf", lv: 2, label: "Back to Shanghai", title: "War sends Peng back to Shanghai", ch: "back",
      body: "When Japan invaded Hong Kong in December 1941, Peng returned to Shanghai on a Japanese cargo ship.{{tayng}} He enrolled at the Zhonghua school, founded in 1937 by the Deaf educator He Yulin, where Deaf teachers led and signing was the main medium.{{lin}}",
      why: "This is where he gained the Shanghainese Sign Language he later took to Singapore. He also learned some ASL.{{podcast}}" },
    { y: 1948, lane: "society", lv: 2, label: "Entry limited", title: "Entry to Singapore narrows", ch: "singapore",
      body: "From October 1948, a colonial policy limited entry to relatives of legal residents and some skilled workers. That year's Malayan citizenship rules also carried a Malay or English language requirement.{{hsu}}",
      why: "Language became part of who could belong, a theme that returns in every later policy." },
    { y: 1948, lane: "deaf", lv: 1, label: "To Singapore", title: "Peng reaches Singapore", ch: "singapore",
      body: "At 21, Peng came to join his father's greeting card business. Employers turned him down because he was Deaf, and he recalled, “I couldn't find a single deaf person!”{{biblio}}",
      why: "He came for family, not as a refugee. Other sources give 1950 or 1951 for his arrival.{{tayposter}}{{lee}}" },
    { y: 1949, lane: "society", lv: 1, label: "PRC founded", title: "The People's Republic of China is founded", ch: "cr",
      body: "Another wave left Shanghai after 1949. Emigration then stayed low from the 1950s until the late 1970s.{{roots}}",
      why: "For Singapore, this helped end the era of large new arrivals from China, so existing communities had to carry their languages forward." },
    { y: 1953, lane: "society", lv: 0, label: "New ordinance", title: "A new immigration ordinance", ch: "cr",
      body: "The 1953 ordinance admitted only those seen as contributing to Singapore's social and economic development. It curbed manual workers and favored professional and managerial skills.{{mpi}}",
      why: "By the time of the Cultural Revolution, the door to Singapore had been narrowing for decades." },
    { y: 1954, lane: "deaf", lv: 0, label: "First school", title: "The first signing school opens", ch: "school",
      body: "After teaching four students at his parents' home and raising over $3,000 door to door, Peng opened the Singapore Chinese School for the Deaf on Charlton Road.{{podcast}}{{biblio}} It taught in SSL and written Chinese.{{tayng}} In 1957 another Deaf man from Shanghai, Joseph Koo, founded an art school that also taught Chinese writing and SSL.{{tayng}}",
      why: "This is how Chinese influence entered SgSL: through a school, more than through any direct effect of spoken Chinese." },
    { y: 1963, lane: "society", lv: 2, label: "Malaysia merger", title: "Singapore joins Malaysia, then leaves", ch: "malaysia",
      body: "Singapore was part of Malaysia from 1963 until independence in 1965. Malay kept its status as the national language afterward, for historical and policy reasons.{{tayng}} In the 1960s, Malay was added to the curriculum at both Deaf schools.{{biblio}}",
      why: "The two countries split politically but kept sharing words, students and sign language influences." },
    { y: 1963, lane: "deaf", lv: 2, label: "Schools merge", title: "Sign and oral schools merge", ch: "school",
      body: "In November 1963, Peng's school and the Red Cross oral school merged into the Singapore School for the Deaf on Mountbatten Road. Peng became principal of the sign section.{{biblio}}{{medium}}",
      why: "SSL and English oralism now sat under one roof, setting up the conflict of the 1970s." },
    { y: 1966, lane: "society", lv: 1, label: "Bilingual policy", title: "English–mother tongue bilingualism", ch: "spoken",
      body: "Schools made English the first language, with a “mother tongue” assigned by ethnicity: Mandarin, Malay or Tamil, whatever a family actually spoke at home.{{tayng}}",
      why: "It set the pattern of the next 50 years: English for the economy, a mother tongue for culture. It had no place for sign language." },
    { y: 1966.7, lane: "society", lv: 0, label: "Cultural Revolution", when: "1966–1976", title: "The Cultural Revolution", ch: "cr",
      body: "This upheaval drove many people to flee, mostly to Hong Kong. Illegal crossings peaked in 1957, 1962, 1972 and 1979, some by swimming Dapeng and Shenzhen bays at night. One researcher estimates about two million crossed over those decades.{{scmp}}",
      why: "It did not shape Peng's route: he had been in Singapore for 18 years. I found no evidence of large Cultural Revolution migration to Singapore." },
    { y: 1967, lane: "deaf", lv: 0, label: "Exemption", title: "Deaf students are exempted from mother tongue", ch: "school",
      body: "From November 1967, Deaf students at the School for the Deaf were exempted from mother tongue study, on the assumption that one language was enough.{{tayng}}",
      why: "Loh calls SgSL a “mother tongue orphan”: it belongs to no ethnic group in the state's scheme, and many Deaf people feel distant from their assigned mother tongue.{{tayng}}" },
    { y: 1975, lane: "deaf", lv: 2, label: "ASL, SEE-II arrive", title: "Lim Chin Heng brings back ASL and SEE-II", ch: "shift",
      body: "Lim, Peng's former student, went to America because Singapore had no Deaf secondary school. He studied at Gallaudet and in 1975 introduced ASL, SEE-II and Total Communication.{{tayng}}",
      why: "A second layer arrives. By Lee's 2016 count, 64% to 72% of a 100-concept list has a sign similar to ASL.{{lee}}" },
    { y: 1976, lane: "deaf", lv: 1, label: "Parsons visits", title: "Frances Parsons comes to train teachers", ch: "shift",
      body: "Parsons, a Deaf Gallaudet professor on a world tour, contrasted SSL's “unstructured” signs with SEE-II's “structured” ones. Peng himself then decided to drop SSL, and the school adopted Total Communication.{{tayng}} She pressed the same case in Malaysia that year.{{penang}}",
      why: "A claim about what counts as language changed what children were taught. Linguists now treat natural sign languages as full languages.{{ntu}}" },
    { y: 1978, lane: "deaf", lv: 0, label: "Sign section ends", title: "The Chinese sign section is phased out", ch: "shift",
      body: "The school moved to SEE-II with spoken English, and the Chinese section was phased out by 1978, in line with the English-based bilingual policy.{{tayng}} Another source gives 1983.{{lee}}",
      why: "SSL lost its institutional home. Older signers still use it privately but feel embarrassed to use it in the wider community.{{tayng}}" },
    { y: 1979, lane: "society", lv: 2, label: "Speak Mandarin", title: "The Speak Mandarin Campaign begins", ch: "spoken",
      body: "Launched on 7 September 1979, the campaign aimed to give Chinese Singaporeans a common language in place of dialects. From 1980 to 1989, Primary One pupils from mainly dialect-speaking homes fell from 64% to 7%, while those from Mandarin-speaking homes rose from 26% to 69%.{{smc}}",
      why: "Hokkien and Cantonese receded at home, yet their particles stayed in Singlish. The Chinese sign section had already closed the year before, so Mandarin's rise brought no gain for SSL. That timing is my observation." },
    { y: 1981, lane: "society", lv: 1, label: "Dialect TV ban", title: "Dialects leave the airwaves", ch: "spoken",
      body: "Dialect ads were phased out from 1978. Dialect TV programs were banned in 1981, and dialect radio ended on 1 January 1983.{{smc}} One press report dates the TV ban to 1982.{{scmpdialect}}",
      why: "Malaysia went the other way: its TV2 began regular Cantonese and Hokkien dramas in 1984.{{tv2}}" },
    { y: 1987, lane: "society", lv: 0, label: "Last Chinese school", title: "The last Chinese-medium school closes", ch: "spoken",
      body: "Enrollment had been falling for decades. Tamil-medium enrollment closed in 1982, Malay-medium followed, and the last Chinese-medium school closed in 1987 as a national system made English every student's first school language.{{tayng}}",
      why: "Deaf education had made the same switch nearly a decade earlier." },
    { y: 1990, lane: "deaf", lv: 1, label: "Sign for Singapore", title: "Sign for Singapore is published", ch: "today",
      body: "This book recorded about 700 signs, including local ones such as Changi Airport, MRT, satay, durian and Deepavali.{{biblio}}",
      why: "Local life had become part of the vocabulary, and it was now in print." },
    { y: 1994, lane: "deaf", lv: 0, label: "Official-language bid", title: "A first call for official status", ch: "today",
      body: "The Singapore Association for the Deaf sought recognition of sign language as Singapore's fifth official language.{{biblio}}",
      why: "The question is still open three decades later." },
    { y: 2000, lane: "society", lv: 0, label: "Speak Good English", title: "The Speak Good English Movement", ch: "spoken",
      body: "The movement promoted Standard English and discouraged Singlish, setting off a long public debate.{{tayng}}",
      why: "The same hierarchy appears among signers: SEE is treated as “proper,” while SgSL, like Singlish, gets called “broken English.”{{tayng}}" },
    { y: 2007, lane: "deaf", lv: 1, label: "SgSL named", title: "“Singapore Sign Language” gets its name", ch: "today",
      body: "The language long called Native Sign Language was officially named SgSL in 2007, according to Tay and Ng.{{tayng}} Other sources give 2008 or 2009.{{biblio}}{{signbank}}",
      why: "A name helped signers claim it as a language of their own." },
    { y: 2015, lane: "deaf", lv: 3, label: "SgSL classes", title: "SgSL classes begin", ch: "today",
      body: "SADeaf began SgSL Level 1 and 2 classes in April 2015, replacing SEE classes, and NTU offered SgSL as an elective.{{tayng}}{{biblio}}",
      why: "The language moved from being stigmatized to being taught." },
    { y: 2017, lane: "deaf", lv: 2, label: "SSD closes", title: "The School for the Deaf closes", ch: "today",
      body: "The school closed as enrollment fell. Younger Deaf children increasingly grow up with oral methods and cochlear implants.{{tayng}}{{biblio}}",
      why: "Tay and Ng consider SgSL endangered because it is not being passed down to younger generations.{{tayng}}" },
    { y: 2018, lane: "deaf", lv: 1, label: "School program", title: "SgSL enters a mainstream school", ch: "today",
      body: "Mayflower Primary School began enrolling Deaf students in 2018, with an SgSL program in its mainstream curriculum.{{tayng}}",
      why: "This is the first time SgSL itself, not a code for English, is designated for Deaf education.{{signbank}}" },
    { y: 2019, lane: "deaf", lv: 0, label: "Sign Bank", title: "The SgSL Sign Bank launches", ch: "today",
      body: "The Sign Bank launched in September 2019, and reached 786 documented signs by early 2025.{{hey}} Peng died in October 2018, aged 92, and received the Public Service Medal posthumously in 2019.{{biblio}}",
      why: "For the first time, signers' everyday signs have a public record, but it does not yet record where each sign came from.{{signbank}}" },
    { y: 2024, lane: "society", lv: 0, anchor: "end", label: "Recognition review", title: "The government reviews official status", ch: "today",
      body: "In February 2024, the Ministry of Social and Family Development announced a review of making SgSL an official language.{{biblio}} In February 2025, it said the study was still underway.{{msf}}",
      why: "I found no announced outcome. Check for updates before you present." }
  ];

  var JOURNEYS = [
    { name: "KAYPOH", steps: ["Chinese-origin word", "Singlish for “busybody”", "Roman letters K, P", "Fingerspelled in SgSL"], c: ["tayng", "medium"] },
    { name: "CHEONGSAM", steps: ["Fashionable in 1920s Shanghai", "Cantonese name, “long dress”", "Worn in Singapore from the 1930s", "A local SgSL sign"], c: ["cheongsam", "tayng"] },
    { name: "ALAMAK", steps: ["Malay exclamation", "In the OED, evidence from 1952", "Everyday Singlish", "A sign in SgSL"], c: ["oed2025", "tayng"] },
    { name: "WATER", steps: ["W-shaped hand in Shanghai", "Peng's school, 1954", "ASL arrives, 1975", "Judged identical to ASL today"], c: ["lin", "lee"], note: "A possible path, not a proven one." }
  ];

  window.STORY = { TIMELINE: TIMELINE, COLORS: C, PLACES: PLACES, CHAPTERS: CHAPTERS, POLICY: POLICY, SOURCES: SOURCES, LAYERS: LAYERS, JOURNEYS: JOURNEYS };
})();
