import { VocabularyWord, InterviewQuestion, QuizQuestion, Badge, LeaderboardUser, TrackId } from '../types/index.ts';

export const TRACK_INFO: Record<TrackId, { name: string; icon: string; description: string; color: string }> = {
  iks: {
    name: 'Indian Knowledge Systems & Philosophy',
    icon: 'Scroll',
    description: 'Classical logic (Nyaya), dialectics (Vāda), ethical leadership (Dharma), and epistemological vocabulary.',
    color: 'amber'
  },
  tech: {
    name: 'Computer Science & AI Studies',
    icon: 'Cpu',
    description: 'System design terminology, algorithmic thinking, precision vocabulary, and technical articulation.',
    color: 'indigo'
  },
  business: {
    name: 'Business, Management & Economics',
    icon: 'Briefcase',
    description: 'Executive presence, negotiations, strategic communication, and boardroom discourse.',
    color: 'emerald'
  },
  medicine: {
    name: 'Life Sciences & Healthcare',
    icon: 'HeartPulse',
    description: 'Clinical empathy, scientific rigor, diagnostic communication, and bioethics.',
    color: 'rose'
  },
  humanities: {
    name: 'Civil Services, Law & Humanities',
    icon: 'Scale',
    description: 'Constitutional nuance, jurisprudence, rhetoric, and analytical administrative vocabulary.',
    color: 'purple'
  },
  general: {
    name: 'Everyday Fluency & Idiomatic English',
    icon: 'Sparkles',
    description: 'Natural conversational idioms, nuanced social expression, and versatile interview polish.',
    color: 'sky'
  }
};

export const INITIAL_VOCABULARY_WORDS: VocabularyWord[] = [
  // IKS & Philosophy Track
  {
    id: 'vocab-1',
    word: 'Equanimity',
    phonetic: '/ˌek.wəˈnɪm.ə.t̬i/',
    partOfSpeech: 'noun',
    definition: 'Mental calmness, composure, and evenness of temper, especially in a demanding situation.',
    simpleDefinition: 'Staying calm and steady during tough times.',
    etymology: 'From Latin aequus ("even") + animus ("mind"). Cognate in sentiment to Sanskrit "Samatvam".',
    iksConnection: 'Directly mirrors the Bhagavad Gita principle: "Samatvaṁ yoga ucyate" — equanimity of mind is true mastery.',
    exampleSentence: 'He accepted the critical feedback from the interviewer with remarkable equanimity.',
    interviewContextSentence: 'When our production server crashed right before the client demo, I maintained equanimity and led the fallback protocol.',
    synonyms: ['serenity', 'poise', 'composure', 'sangfroid', 'imperturbability'],
    antonyms: ['agitation', 'hysteria', 'panic', 'discomposure'],
    tracks: ['iks', 'general', 'business'],
    difficulty: 'intermediate',
    masteryStatus: 'learning',
    timesPracticed: 0,
    timesCorrect: 0
  },
  {
    id: 'vocab-2',
    word: 'Epistemic',
    phonetic: '/ˌep.əˈstiː.mɪk/',
    partOfSpeech: 'adjective',
    definition: 'Relating to knowledge, the conditions of its validity, and how we know what we claim to know.',
    simpleDefinition: 'About the nature and grounds of truth or knowledge.',
    etymology: 'From Greek episteme ("knowledge") + -ic. In Indian philosophy, closely corresponds to "Pramāṇa-śāstra" (epistemology).',
    iksConnection: 'Central to Nyaya and Buddhist epistemology, which establish that every claim requires valid sources (Pramāṇa: perception, inference, testimony).',
    exampleSentence: 'Scientific theories must have strong epistemic justification before being cited as facts.',
    interviewContextSentence: 'I demonstrated epistemic humility by verifying our machine learning model against empirical test distributions.',
    synonyms: ['cognitive', 'intellectual', 'theoretical', 'rational'],
    antonyms: ['dogmatic', 'unsubstantiated', 'irrational'],
    tracks: ['iks', 'tech', 'humanities'],
    difficulty: 'advanced',
    masteryStatus: 'learning',
    timesPracticed: 0,
    timesCorrect: 0
  },
  {
    id: 'vocab-3',
    word: 'Perspicacity',
    phonetic: '/ˌpɝː.spəˈkæs.ə.t̬i/',
    partOfSpeech: 'noun',
    definition: 'The capacity to discern nuances, grasp subtle insights, and understand complex matters quickly.',
    simpleDefinition: 'Acuteness of judgment and deep insight.',
    etymology: 'From Latin perspicax ("clear-sighted"), cognate in essence to Sanskrit "Prajñā" (transcendent discernment).',
    iksConnection: 'Reflects the concept of Prajñā and Viveka (discrimination between the essential and non-essential) in Vedanta.',
    exampleSentence: 'Her perspicacity allowed her to spot the logical fallacy in the debate immediately.',
    interviewContextSentence: 'My perspicacity in reviewing legacy codebases helped our startup catch a critical memory leak before launch.',
    synonyms: ['acumen', 'shrewdness', 'penetration', 'insightfulness', 'sagacity'],
    antonyms: ['obtoseness', 'dulness', 'shortsightedness'],
    tracks: ['iks', 'business', 'tech'],
    difficulty: 'advanced',
    masteryStatus: 'learning',
    timesPracticed: 0,
    timesCorrect: 0
  },
  {
    id: 'vocab-4',
    word: 'Dialectic',
    phonetic: '/ˌdaɪ.əˈlek.tɪk/',
    partOfSpeech: 'noun / adjective',
    definition: 'The art or practice of arriving at truth through reasoned discourse, exchange of opposing arguments, and thesis-antithesis synthesis.',
    simpleDefinition: 'Finding the truth through respectful, reasoned discussion between different viewpoints.',
    etymology: 'From Greek dialektike ("art of discussion"). Closely related to the Indian philosophical tradition of "Vāda" (constructive debate seeking truth).',
    iksConnection: 'In the Nyaya Sutras, Vāda represents noble debate aimed at discovering truth, distinct from Jalpa (debating to win) and Vitanda (cavil or destructive criticism).',
    exampleSentence: 'The classroom discussion was a genuine dialectic that enlightened both students and the professor.',
    interviewContextSentence: 'I fostered a healthy dialectic within our engineering team, inviting counter-proposals to strengthen our architecture.',
    synonyms: ['reasoning', 'argumentation', 'discussion', 'intellectual discourse'],
    antonyms: ['dogmatism', 'dictation', 'unilateral decree'],
    tracks: ['iks', 'humanities', 'tech'],
    difficulty: 'intermediate',
    masteryStatus: 'learning',
    timesPracticed: 0,
    timesCorrect: 0
  },
  {
    id: 'vocab-5',
    word: 'Altruistic',
    phonetic: '/ˌæl.truˈɪs.tɪk/',
    partOfSpeech: 'adjective',
    definition: 'Showing a disinterested and selfless concern for the well-being of others.',
    simpleDefinition: 'Selfless and caring for others without expecting personal gain.',
    etymology: 'From French altruiste, coined from Italian altrui ("other people"). Parallels the Sanskrit ideal of "Paropakāra" and "Lokasaṅgraha".',
    iksConnection: 'Central to Indian ethics: "Paropakārāya punyāya" (helping others is the highest virtue) and the welfare of all beings ("Sarve Bhavantu Sukhinah").',
    exampleSentence: 'She dedicated her weekends to mentoring underprivileged students in an altruistic effort to bridge the educational divide.',
    interviewContextSentence: 'While company growth is essential, I believe sustainable organizations must possess an altruistic mission that serves broader society.',
    synonyms: ['benevolent', 'philanthropic', 'selfless', 'charitable', 'magnanimous'],
    antonyms: ['egocentric', 'selfish', 'mercenary', 'narcissistic'],
    tracks: ['iks', 'medicine', 'general'],
    difficulty: 'beginner',
    masteryStatus: 'learning',
    timesPracticed: 0,
    timesCorrect: 0
  },

  // Tech & CS Track
  {
    id: 'vocab-6',
    word: 'Deterministic',
    phonetic: '/dɪˌtɝː.məˈnɪs.tɪk/',
    partOfSpeech: 'adjective',
    definition: 'Involving an outcome that is inevitably determined by preceding conditions or inputs, with zero randomness.',
    simpleDefinition: 'Always yielding the same result given the same starting inputs.',
    etymology: 'From Latin determinare ("to set bounds to, mark off limits").',
    iksConnection: 'Parallels the classical Indian doctrine of causality (Satkāryavāda vs. Asatkāryavāda), examining how effects inhere in their causes.',
    exampleSentence: 'A pure function is deterministic: identical arguments will unequivocally return the identical output.',
    interviewContextSentence: 'We designed the cryptographic verification algorithm to be strictly deterministic to avoid race conditions across nodes.',
    synonyms: ['predictable', 'invariant', 'predetermined', 'systematic'],
    antonyms: ['stochastic', 'random', 'probabilistic', 'indeterminate'],
    tracks: ['tech'],
    difficulty: 'intermediate',
    masteryStatus: 'learning',
    timesPracticed: 0,
    timesCorrect: 0
  },
  {
    id: 'vocab-7',
    word: 'Ameliorate',
    phonetic: '/əˈmiːl.jə.reɪt/',
    partOfSpeech: 'verb',
    definition: 'To make something bad, unsatisfactory, or deficient better; to improve conditions substantially.',
    simpleDefinition: 'To make a bad situation much better.',
    etymology: 'From Latin melior ("better"). Cognate with meliorate.',
    iksConnection: 'Similar to the foundational Ayurvedic and Yogic mission of "Dukha Nivritti" (the alleviation of suffering and disquiet).',
    exampleSentence: 'The updated caching layer served to ameliorate the database latency during peak traffic hours.',
    interviewContextSentence: 'To ameliorate the high onboarding drop-off rate, I redesigned the initial user flow with proactive tooltips.',
    synonyms: ['alleviate', 'mitigate', 'rectify', 'enhance', 'upgrade'],
    antonyms: ['exacerbate', 'worsen', 'aggravate', 'deteriorate'],
    tracks: ['tech', 'business', 'medicine'],
    difficulty: 'intermediate',
    masteryStatus: 'learning',
    timesPracticed: 0,
    timesCorrect: 0
  },
  {
    id: 'vocab-8',
    word: 'Idempotent',
    phonetic: '/ˌaɪ.dəmˈpoʊ.tənt/',
    partOfSpeech: 'adjective',
    definition: 'Denoting an operation that can be applied multiple times without changing the result beyond the initial application.',
    simpleDefinition: 'An action that produces the same effect whether run once or a hundred times.',
    etymology: 'From Latin idem ("same") + potens ("powerful, having power").',
    iksConnection: 'Conceptually related to unchanging immutable states (Kutastha) in Vedic metaphysics.',
    exampleSentence: 'HTTP PUT requests must be idempotent so network retries do not duplicate state modifications.',
    interviewContextSentence: 'By guaranteeing that payment webhook handlers are idempotent, we averted accidental double-billing when clients experienced network drops.',
    synonyms: ['repeatable', 'consistent', 'stable', 'invariant'],
    antonyms: ['side-effecting', 'volatile', 'mutable'],
    tracks: ['tech'],
    difficulty: 'advanced',
    masteryStatus: 'learning',
    timesPracticed: 0,
    timesCorrect: 0
  },

  // Business & Leadership Track
  {
    id: 'vocab-9',
    word: 'Pragmatic',
    phonetic: '/præɡˈmæt̬.ɪk/',
    partOfSpeech: 'adjective',
    definition: 'Dealing with matters sensibly and realistically, in a way that is based on practical rather than theoretical considerations.',
    simpleDefinition: 'Focusing on what really works in practice rather than pure theory.',
    etymology: 'From Greek pragmatikos ("fit for action, businesslike"), from pragma ("deed, act").',
    iksConnection: 'Reflects the political and governance philosophy of Kautilya’s Arthashastra, which emphasizes realistic statecraft and grounded execution.',
    exampleSentence: 'We adopted a pragmatic roadmap that prioritized immediate customer value over perfectionism.',
    interviewContextSentence: 'While the theoretical architecture was elegant, I took a pragmatic stance to launch an MVP within our six-week constraint.',
    synonyms: ['utilitarian', 'expedient', 'realistic', 'sensible', 'hard-headed'],
    antonyms: ['idealistic', 'impractical', 'quixotic', 'doctrinaire'],
    tracks: ['business', 'general', 'tech'],
    difficulty: 'beginner',
    masteryStatus: 'learning',
    timesPracticed: 0,
    timesCorrect: 0
  },
  {
    id: 'vocab-10',
    word: 'Tenacious',
    phonetic: '/təˈneɪ.ʃəs/',
    partOfSpeech: 'adjective',
    definition: 'Holding fast; persistent in maintaining, adhering to, or striving for something valued; not readily relinquishing.',
    simpleDefinition: 'Determined and never giving up easily.',
    etymology: 'From Latin tenax ("holding fast"), from tenere ("to hold"). Parallels the Sanskrit virtue "Dhṛti" (steadfast resolve).',
    iksConnection: 'Embodied in the concept of "Dhṛti" (unshakeable fortitude and perseverance) described in the Mahabharata.',
    exampleSentence: 'Thanks to her tenacious investigation, the regulatory compliance team uncovered the deceptive accounting practice.',
    interviewContextSentence: 'I remained tenacious despite three consecutive compiler deadlocks, ultimately identifying an obscure race condition.',
    synonyms: ['persevering', 'resolute', 'unyielding', 'dogged', 'pertinacious'],
    antonyms: ['vacillating', 'wavering', 'yielding', 'fickle'],
    tracks: ['business', 'general', 'humanities'],
    difficulty: 'beginner',
    masteryStatus: 'learning',
    timesPracticed: 0,
    timesCorrect: 0
  },
  {
    id: 'vocab-11',
    word: 'Paradigm',
    phonetic: '/ˈper.ə.daɪm/',
    partOfSpeech: 'noun',
    definition: 'A typical example or pattern of something; a framework or worldview of shared concepts and practices.',
    simpleDefinition: 'A fundamental model, pattern, or way of thinking.',
    etymology: 'From Greek paradeigma ("pattern, model"), from paradeiknunai ("to show side by side").',
    iksConnection: 'Parallels the concept of "Darśana" (philosophical worldview or foundational perspective of reality).',
    exampleSentence: 'The advent of transformer models precipitated a paradigm shift across natural language processing.',
    interviewContextSentence: 'I helped shift our team’s engineering paradigm from monolithic deployments to distributed microservices.',
    synonyms: ['archetype', 'prototype', 'framework', 'benchmark', 'standard'],
    antonyms: ['anomaly', 'aberration', 'irregularity'],
    tracks: ['business', 'tech', 'humanities'],
    difficulty: 'intermediate',
    masteryStatus: 'learning',
    timesPracticed: 0,
    timesCorrect: 0
  },

  // Medicine & Healthcare Track
  {
    id: 'vocab-12',
    word: 'Efficacy',
    phonetic: '/ˈef.ə.kə.si/',
    partOfSpeech: 'noun',
    definition: 'The ability to produce a desired or intended result, especially in clinical trials or treatments.',
    simpleDefinition: 'The power to produce the wanted effect or cure.',
    etymology: 'From Latin efficacia ("effectual power"), from efficax ("effective").',
    iksConnection: 'Directly linked to Charaka Samhita’s criterion for medicines: "Yukti" (rational combination) ensuring therapeutic efficacy.',
    exampleSentence: 'The double-blind study demonstrated the vaccine’s high clinical efficacy across diverse demographic cohorts.',
    interviewContextSentence: 'In my clinical rotation, I audited patient charts to assess the comparative efficacy of therapeutic interventions.',
    synonyms: ['effectiveness', 'potency', 'utility', 'productivity', 'virtue'],
    antonyms: ['inefficacy', 'futility', 'impotence', 'ineffectiveness'],
    tracks: ['medicine', 'tech'],
    difficulty: 'intermediate',
    masteryStatus: 'learning',
    timesPracticed: 0,
    timesCorrect: 0
  },
  {
    id: 'vocab-13',
    word: 'Prophylactic',
    phonetic: '/ˌproʊ.fəˈlæk.tɪk/',
    partOfSpeech: 'adjective / noun',
    definition: 'Intended to prevent disease or mitigate risk before it occurs; preventive in nature.',
    simpleDefinition: 'Acting as a defense or shield to prevent illness or disaster.',
    etymology: 'From Greek prophylaktikos ("guarding beforehand"), from pro ("before") + phylassein ("to guard").',
    iksConnection: 'Corresponds with the primary tenet of Ayurveda: "Swasthasya swasthya rakshanam" (protecting the health of the healthy through preventive living).',
    exampleSentence: 'Hand hygiene protocols remain the single most potent prophylactic measure in hospital wards.',
    interviewContextSentence: 'I advocate for prophylactic code refactoring to eliminate security vulnerabilities before software release.',
    synonyms: ['preventative', 'protective', 'precautionary', 'deterrent'],
    antonyms: ['curative', 'reactive', 'therapeutic', 'remedial'],
    tracks: ['medicine', 'tech'],
    difficulty: 'advanced',
    masteryStatus: 'learning',
    timesPracticed: 0,
    timesCorrect: 0
  },

  // Humanities, Law & UPSC Track
  {
    id: 'vocab-14',
    word: 'Jurisprudence',
    phonetic: '/ˌdʒʊr.ɪsˈpruː.dəns/',
    partOfSpeech: 'noun',
    definition: 'The theory or philosophy of law; a legal system or body of judicial principles.',
    simpleDefinition: 'The science, philosophy, and study of human law.',
    etymology: 'From Latin jurisprudentia ("the science of law"), from jus ("law") + prudentia ("knowledge, foresight").',
    iksConnection: 'Parallels the Dharmaśāstras and the Mīmāṁsā rules of textual interpretation used in ancient Indian legal hermeneutics.',
    exampleSentence: 'Constitutional jurisprudence in India has consistently expanded the scope of Article 21 to include dignity and privacy.',
    interviewContextSentence: 'My grounding in constitutional jurisprudence helps me balance regulatory compliance with agile innovation.',
    synonyms: ['legal philosophy', 'statutory theory', 'constitutionality'],
    antonyms: ['lawlessness', 'anarchy'],
    tracks: ['humanities'],
    difficulty: 'advanced',
    masteryStatus: 'learning',
    timesPracticed: 0,
    timesCorrect: 0
  },
  {
    id: 'vocab-15',
    word: 'Sagacious',
    phonetic: '/səˈɡeɪ.ʃəs/',
    partOfSpeech: 'adjective',
    definition: 'Having or showing keen mental discernment and good judgment; wise, shrewd, and farsighted.',
    simpleDefinition: 'Very wise, insightful, and good at making thoughtful decisions.',
    etymology: 'From Latin sagax ("of quick perception, acute"), cognate in connotation to Sanskrit "Ṛṣi" (seer) or "Prajña".',
    iksConnection: 'Characterizes the Vidura-nīti ideal of statesmanship, where wisdom is guided by righteousness and foresight.',
    exampleSentence: 'The dean’s sagacious guidance averted what could have been a polarizing campus conflict.',
    interviewContextSentence: 'I seek out sagacious mentors whose industry perspective helps me anticipate emerging technology trends.',
    synonyms: ['discerning', 'judicious', 'astute', 'perceptive', 'erudite'],
    antonyms: ['foolish', 'fatuous', 'injudicious', 'shortsighted'],
    tracks: ['humanities', 'iks', 'business'],
    difficulty: 'advanced',
    masteryStatus: 'learning',
    timesPracticed: 0,
    timesCorrect: 0
  },
  {
    id: 'vocab-16',
    word: 'Juxtaposition',
    phonetic: '/ˌdʒʌk.stə.pəˈzɪʃ.ən/',
    partOfSpeech: 'noun',
    definition: 'The fact of two things being seen or placed close together with contrasting effect.',
    simpleDefinition: 'Placing two contrasting things side by side to compare them.',
    etymology: 'From Latin juxta ("near") + position.',
    iksConnection: 'Frequently used in classical Indian aesthetics (Alaṅkāra-śāstra) where contrast (Vyatireka) illuminates literary beauty.',
    exampleSentence: 'The documentary relied on the stark juxtaposition of rural craftsmanship and robotic automation.',
    interviewContextSentence: 'In my presentation, I used a side-by-side juxtaposition of legacy response times versus our streamlined architecture.',
    synonyms: ['contrast', 'proximity', 'adjacency', 'comparison', 'collocation'],
    antonyms: ['separation', 'isolation', 'remoteness'],
    tracks: ['humanities', 'general'],
    difficulty: 'intermediate',
    masteryStatus: 'learning',
    timesPracticed: 0,
    timesCorrect: 0
  },
  {
    id: 'vocab-17',
    word: 'Cogent',
    phonetic: '/ˈkoʊ.dʒənt/',
    partOfSpeech: 'adjective',
    definition: 'Clear, logical, and convincing in thought or argument; having the power to compel belief.',
    simpleDefinition: 'Strongly persuasive and completely reasonable.',
    etymology: 'From Latin cogens, from cogere ("to drive together, compel").',
    iksConnection: 'Corresponds directly to "Samyak Yukti" (sound reasoning) in Buddhist and Jaina debate traditions.',
    exampleSentence: 'Her presentation offered a cogent defense of the new renewable energy policy.',
    interviewContextSentence: 'To convince senior stakeholders, I delivered a cogent business case grounded in measurable ROI projections.',
    synonyms: ['compelling', 'persuasive', 'incisive', 'lucid', 'irrefutable'],
    antonyms: ['unconvincing', 'flimsy', 'incoherent', 'specious'],
    tracks: ['general', 'business', 'iks', 'humanities'],
    difficulty: 'intermediate',
    masteryStatus: 'learning',
    timesPracticed: 0,
    timesCorrect: 0
  },
  {
    id: 'vocab-18',
    word: 'Resilience',
    phonetic: '/rɪˈzɪl.jəns/',
    partOfSpeech: 'noun',
    definition: 'The capacity to withstand or recover quickly from difficulties; toughness and adaptability.',
    simpleDefinition: 'The ability to bounce back after facing setbacks or hardships.',
    etymology: 'From Latin resilire ("to spring back, rebound").',
    iksConnection: 'Exemplified by the concept of "Titikṣā" (forbearance and patient endurance) in Indian philosophical treatises.',
    exampleSentence: 'The startup’s survival through market volatility attested to the team’s organizational resilience.',
    interviewContextSentence: 'When our initial release was met with unexpected user friction, I demonstrated resilience by orchestrating rapid iterations.',
    synonyms: ['fortitude', 'endurance', 'adaptability', 'buoyancy', 'grit'],
    antonyms: ['fragility', 'vulnerability', 'inflexibility', 'brittleness'],
    tracks: ['general', 'business', 'iks', 'tech'],
    difficulty: 'beginner',
    masteryStatus: 'learning',
    timesPracticed: 0,
    timesCorrect: 0
  }
];

export const INITIAL_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // IKS & Philosophy / Ethical Reasoning
  {
    id: 'iq-1',
    track: 'iks',
    category: 'iks_philosophy',
    difficulty: 'intermediate',
    title: 'Resolution of Ethical Dilemma in Leadership',
    question: 'Describe a situation where you faced competing priorities or an ethical trade-off in your studies or projects. How did you determine the righteous course of action?',
    recommendedKeywords: ['Equanimity', 'Dharma / Duty', 'Dialectic', 'Perspicacity', 'Integrity', 'Pragmatic'],
    sampleStarFramework: {
      situation: 'During our final semester capstone project, our team discovered a minor security flaw two days before the submission deadline.',
      task: 'I had to decide whether to submit quietly to guarantee an A grade or disclose the flaw and risk delayed grading.',
      action: 'I convened the team for a calm dialectic, framing our responsibility to ethical transparency and long-term user trust rather than transient convenience.',
      result: 'We patched the flaw with equanimity; our evaluator commended our candid disclosure and awarded us highest honors for integrity.'
    },
    tips: 'Use the Indian rhetorical framework of Pratijñā (premise), Hetu (reason), and Udāharaṇa (example). Show calm composure.',
    culturalInsight: 'Reflects the principle of "Satyam Vada, Dharmam Chara" (Speak truth, act with duty) balanced with pragmatic wisdom.'
  },
  {
    id: 'iq-2',
    track: 'iks',
    category: 'leadership',
    difficulty: 'advanced',
    title: 'Handling Disagreement and Reaching Synthesis',
    question: 'How do you navigate deep intellectual disagreement with a peer or supervisor without compromising collaboration?',
    recommendedKeywords: ['Dialectic', 'Vāda debate', 'Epistemic humility', 'Cogent', 'Perspicacious', 'Ameliorate'],
    sampleStarFramework: {
      situation: 'A senior architect wanted an aggressive caching strategy while I was concerned about cache invalidation race conditions.',
      task: 'I needed to voice legitimate technical concerns respectfully without triggering defensive conflict.',
      action: 'Instead of adversarial confrontation, I adopted the ancient Vāda methodology: I first articulated his perspective thoroughly to establish mutual understanding, then presented empirical load-test data.',
      result: 'The cogent evidence persuaded the team to adopt a hybrid strategy, uniting both performance and consistency.'
    },
    tips: 'Showcase active listening and intellectual humility. Frame debate as cooperative truth-seeking.',
    culturalInsight: 'In Nyaya philosophy, "Vāda" is debate with a shared desire to discover truth, contrasting with ego-driven "Jalpa".'
  },

  // Tech & Engineering Track
  {
    id: 'iq-3',
    track: 'tech',
    category: 'technical',
    difficulty: 'intermediate',
    title: 'Explaining a Complex Concept to a Non-Technical Stakeholder',
    question: 'How do you explain an intricate technical architecture or problem (such as asynchronous queuing, caching, or latency) to someone with no computer science background?',
    recommendedKeywords: ['Perspicacity', 'Ameliorate', 'Juxtaposition', 'Deterministic', 'Lucid', 'Intuitive'],
    sampleStarFramework: {
      situation: 'Our marketing director was frustrated that bulk data exports took several minutes to generate.',
      task: 'I had to explain background workers and asynchronous queuing without overwhelming them with backend jargon.',
      action: 'I used a relatable restaurant metaphor: juxtaposing a busy chef trying to cook while running to deliver food with a restaurant employing a dedicated waiter line.',
      result: 'They immediately understood why we were decoupling the tasks and approved the infrastructure budget.'
    },
    tips: 'Avoid unneeded acronyms. Use vivid analogies, structured milestones, and precise language.',
    culturalInsight: 'In ancient Indian teaching (Guru-Shishya tradition), teachers always grounded abstract metaphysics in "Dṛṣṭānta" (familiar everyday metaphors).'
  },
  {
    id: 'iq-4',
    track: 'tech',
    category: 'behavioral',
    difficulty: 'advanced',
    title: 'Diagnosing and Fixing a Critical Outage under Pressure',
    question: 'Tell me about a high-stress bug or system failure you encountered. How did you maintain clarity, isolate the root cause, and implement a robust resolution?',
    recommendedKeywords: ['Equanimity', 'Deterministic', 'Idempotent', 'Tenacious', 'Methodical', 'Ameliorate'],
    sampleStarFramework: {
      situation: 'Thirty minutes before a regional product release, our authentication service started dropping 40% of requests.',
      task: 'I was designated incident commander responsible for triage and restoration.',
      action: 'Maintaining equanimity, I analyzed log traces systematically to isolate deterministic database connection exhaustion, rolled back the last migration, and made our retry loops idempotent.',
      result: 'Normal service restored within twelve minutes with zero corrupted session tokens.'
    },
    tips: 'Highlight structured troubleshooting, emotional composure, and post-mortem learnings.',
    culturalInsight: 'Demonstrates "Samatvam" (unshakable poise) when external circumstances are volatile.'
  },

  // Business & Management Track
  {
    id: 'iq-5',
    track: 'business',
    category: 'behavioral',
    difficulty: 'intermediate',
    title: 'Tell Me About a Time You Influenced Without Authority',
    question: 'How have you persuaded cross-functional peers or senior teammates to adopt your recommendation when you were not their designated manager?',
    recommendedKeywords: ['Cogent', 'Pragmatic', 'Paradigm', 'Perspicacity', 'Resilience', 'Facilitate'],
    sampleStarFramework: {
      situation: 'Our university club was struggling with declining event attendance due to fragmented communication channels.',
      task: 'I was a junior member proposing that we consolidate our efforts onto a single unified digital portal.',
      action: 'I built a working prototype and presented a cogent summary juxtaposing past attrition rates with the streamlined user experience.',
      result: 'The executive committee unanimously adopted the platform, boosting our subsequent workshop attendance by 65%.'
    },
    tips: 'Focus on empathy, data-driven persuasion, and low-friction prototypes.',
    culturalInsight: 'Parallels Kautilya’s diplomatic councils (Upāyas) which emphasize alignment of incentives.'
  },

  // General & Universal Interview Questions
  {
    id: 'iq-6',
    track: 'general',
    category: 'behavioral',
    difficulty: 'beginner',
    title: 'Introduce Yourself Articulately in 60 Seconds',
    question: 'Please walk me through your background, your primary intellectual interests, and what motivates you to excel in this field.',
    recommendedKeywords: ['Tenacious', 'Pragmatic', 'Altruistic', 'Resilience', 'Aspire', 'Cultivate'],
    sampleStarFramework: {
      situation: 'Opening statement introducing your academic origin and formative passion.',
      task: 'Highlighting pivotal projects where you merged academic rigor with practical impact.',
      action: 'Articulating how you continuously expand your linguistic, technical, and cultural horizons.',
      result: 'Closing with a forward-looking vision of how you intend to contribute to this organization.'
    },
    tips: 'Speak with controlled cadence. Lead with impact, avoid monotonous chronological resumes.',
    culturalInsight: 'Deliver your narrative with clarity, grounded modesty, and unmistakable conviction.'
  }
];

export const INITIAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-1',
    word: 'Equanimity',
    track: 'iks',
    difficulty: 'intermediate',
    question: 'When unexpected cross-examination disrupted the candidate’s presentation, she retained her ________, answering each objection with poised clarity.',
    options: ['equanimity', 'impetuosity', 'truculence', 'trepidation'],
    correctIndex: 0,
    explanation: 'Equanimity signifies emotional composure and evenness of mind in the face of pressure.',
    phonetic: '/ˌek.wəˈnɪm.ə.t̬i/',
    iksNote: 'Corresponds with "Samatvam" from the Bhagavad Gita—mental balance unaffected by external praise or blame.'
  },
  {
    id: 'q-2',
    word: 'Dialectic',
    track: 'iks',
    difficulty: 'intermediate',
    question: 'The symposium was not a contentious shouting match, but a true ________ where opposing views synthesized into deeper wisdom.',
    options: ['soliloquy', 'polemic', 'dialectic', 'dogma'],
    correctIndex: 2,
    explanation: 'A dialectic is an open, reasoned discourse where contrasting arguments reveal greater truth.',
    phonetic: '/ˌdaɪ.əˈlek.tɪk/',
    iksNote: 'Mirrors the ancient tradition of Vāda (constructive dialogue) codified in the Nyaya Darshana.'
  },
  {
    id: 'q-3',
    word: 'Ameliorate',
    track: 'tech',
    difficulty: 'intermediate',
    question: 'Deploying a distributed cache layer served to ________ the system bottlenecks experienced during festive flash sales.',
    options: ['exacerbate', 'ameliorate', 'procrastinate', 'vacillate'],
    correctIndex: 1,
    explanation: 'Ameliorate means to improve a difficult condition or make something substantially better.',
    phonetic: '/əˈmiːl.jə.reɪt/',
    iksNote: 'Parallel to "Dukha Nivritti" (the systematic alleviation of distress or friction).'
  },
  {
    id: 'q-4',
    word: 'Perspicacity',
    track: 'business',
    difficulty: 'advanced',
    question: 'Thanks to her financial ________, the chief strategist detected the impending currency devaluation weeks before the market reacted.',
    options: ['complacency', 'perspicacity', 'ambivalence', 'audacity'],
    correctIndex: 1,
    explanation: 'Perspicacity is keen mental discernment and the capacity to perceive subtle truths.',
    phonetic: '/ˌpɝː.spəˈkæs.ə.t̬i/',
    iksNote: 'Conceptually related to "Prajñā" (elevated discernment) and "Viveka" in classical Indian epistemology.'
  },
  {
    id: 'q-5',
    word: 'Cogent',
    track: 'humanities',
    difficulty: 'intermediate',
    question: 'The lawyer constructed a ________ argument backed by three constitutional precedents that left no room for ambiguity.',
    options: ['cogent', 'specious', 'tentative', 'convoluted'],
    correctIndex: 0,
    explanation: 'Cogent means clear, logical, deeply persuasive, and compelling.',
    phonetic: '/ˈkoʊ.dʒənt/',
    iksNote: 'Reflects "Samyak Yukti" (sound and unassailable reasoning) honored in ancient Indian debate assemblies.'
  },
  {
    id: 'q-6',
    word: 'Deterministic',
    track: 'tech',
    difficulty: 'intermediate',
    question: 'Unlike machine learning models that generate probabilistic tokens, cryptographic hash functions are strictly ________.',
    options: ['stochastic', 'deterministic', 'ephemeral', 'nebulous'],
    correctIndex: 1,
    explanation: 'Deterministic systems always produce the exact same outcome given identical input states.',
    phonetic: '/dɪˌtɝː.məˈnɪs.tɪk/',
    iksNote: 'Parallels the Satkāryavāda premise that an effect pre-exists deterministically in its material cause.'
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-first-word',
    title: 'First Spark',
    description: 'Mastered your very first vocabulary word and reviewed its etymological roots.',
    icon: 'Sparkle',
    category: 'vocabulary',
    criteriaText: 'Master 1 word'
  },
  {
    id: 'badge-3-streak',
    title: 'Triad Consistency',
    description: 'Maintained a 3-day active practice streak without letting the flame expire.',
    icon: 'Flame',
    category: 'streak',
    criteriaText: '3-day streak'
  },
  {
    id: 'badge-7-streak',
    title: 'Weekly Warrior',
    description: 'Completed 7 unbroken days of linguistic study across devices.',
    icon: 'Trophy',
    category: 'streak',
    criteriaText: '7-day streak'
  },
  {
    id: 'badge-iks-scholar',
    title: 'Vāda-Vidyā Scholar',
    description: 'Mastered 5 vocabulary concepts connected to Indian Knowledge Systems and logic.',
    icon: 'Scroll',
    category: 'iks',
    criteriaText: 'Master 5 IKS vocabulary words'
  },
  {
    id: 'badge-interview-voice',
    title: 'Orator of the Mic',
    description: 'Delivered an interview answer using the speech recognition microphone.',
    icon: 'Mic',
    category: 'interview',
    criteriaText: 'Complete 1 voice interview response'
  },
  {
    id: 'badge-ink-master',
    title: 'Ink & Quill',
    description: 'Utilized the digital handwriting pad to write out practice terms and response blueprints.',
    icon: 'PenTool',
    category: 'interview',
    criteriaText: 'Use the writing canvas pad'
  },
  {
    id: 'badge-quiz-ace',
    title: 'Centurion of Quizzes',
    description: 'Scored 100% accuracy on a progressive vocabulary quiz challenge.',
    icon: 'Award',
    category: 'mastery',
    criteriaText: 'Score 100% on any quiz'
  },
  {
    id: 'badge-cloud-sync',
    title: 'Cloud Connected',
    description: 'Generated a persistent Sync Code and backed up your progress to the cloud.',
    icon: 'Cloud',
    category: 'mastery',
    criteriaText: 'Perform a successful cloud sync'
  },
  {
    id: 'badge-elevated-speaker',
    title: 'Articulate Statesman',
    description: 'Achieved an interview score of 85+ with zero excessive filler words.',
    icon: 'Crown',
    category: 'interview',
    criteriaText: 'Score 85+ on an interview evaluation'
  }
];

export const INITIAL_LEADERBOARD_USERS: LeaderboardUser[] = [
  {
    id: 'u-1',
    name: 'Aarav Sharma',
    avatar: '👨‍🎓',
    track: 'iks',
    xp: 2840,
    streak: 18,
    wordsMastered: 84
  },
  {
    id: 'u-2',
    name: 'Priyanka Patel',
    avatar: '👩‍💻',
    track: 'tech',
    xp: 2420,
    streak: 12,
    wordsMastered: 68
  },
  {
    id: 'u-3',
    name: 'Rohan Deshmukh',
    avatar: '👨‍💼',
    track: 'business',
    xp: 2190,
    streak: 9,
    wordsMastered: 59
  },
  {
    id: 'u-4',
    name: 'Ananya Sen',
    avatar: '👩‍⚖️',
    track: 'humanities',
    xp: 1980,
    streak: 14,
    wordsMastered: 52
  },
  {
    id: 'u-5',
    name: 'Dr. Vikram Varma',
    avatar: '👨‍⚕️',
    track: 'medicine',
    xp: 1750,
    streak: 8,
    wordsMastered: 46
  }
];

export const UNLOCKABLE_MODULES = [
  {
    id: 'mod-1',
    title: 'Vāda-Vidyā: The Classical Art of Debate & Persuasion',
    track: 'iks',
    requiredLevel: 2,
    xpReward: 300,
    description: 'Learn the 5-part Nyaya syllogism (Pratijna, Hetu, Udaharana, Upanaya, Nigamana) to structure unassailable interview answers.',
    unlocked: true
  },
  {
    id: 'mod-2',
    title: 'The Executive STAR Storytelling Playbook',
    track: 'business',
    requiredLevel: 2,
    xpReward: 350,
    description: 'Transform mundane academic projects into compelling situational narratives of quantifiable leadership.',
    unlocked: false
  },
  {
    id: 'mod-3',
    title: 'Algorithmic Articulation for Technical Leads',
    track: 'tech',
    requiredLevel: 3,
    xpReward: 500,
    description: 'Master elevated vocabulary for system trade-offs, fault tolerance, and concurrency without losing clarity.',
    unlocked: false
  }
];
