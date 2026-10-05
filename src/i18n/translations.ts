export type Language = 'ko' | 'en';

export interface Translations {
  // Tabs & Navigation
  tabHome: string;
  tabRoutine: string;
  tabHistory: string;
  tabProfile: string;

  // Header & Settings
  appTitle: string;
  appSubtitle: string;
  settingsTitle: string;
  workoutTime: string;
  restTime: string;
  setsCount: string;
  demoSpeed: string;
  save: string;
  delete: string;
  cancel: string;
  close: string;
  language: string;
  languageName: string;
  loginTitle: string;
  loginSubtitle: string;
  loginSuccess: string;
  welcomeUser: string;
  processingGoogleLogin: string;
  processingKakaoLogin: string;
  pleaseWait: string;
  userMember: string;
  kakaoLogin: string;
  googleLogin: string;
  guestLogin: string;
  logout: string;
  inquiryTitle: string;
  inquirySubtitle: string;
  inquiryCategory: string;
  inquiryCategoryBug: string;
  inquiryCategoryFeature: string;
  inquiryCategoryPayment: string;
  inquiryCategoryAccount: string;
  inquiryCategoryGeneral: string;
  inquiryTitlePlaceholder: string;
  inquiryContentPlaceholder: string;
  inquiryEmailPlaceholder: string;
  inquirySubmit: string;
  inquirySuccess: string;

  // Home Screen
  todayStats: string;
  todayWorkouts: string;
  todaySets: string;
  freeWorkoutStart: string;
  comboRoutineTitle: string;
  comboRoutineDesc: string;
  newBadge: string;
  configWorkout: string;
  configRest: string;
  configSets: string;

  // Routine Builder Screen & Wireframe Panel
  builderTitle: string;
  builderSubtitle: string;
  targetWorkoutTime: string;
  tempoSpeed: string;
  tempoFast: string;
  tempoNormal: string;
  tempoSlow: string;
  timelineTitle: string;
  singleCycle: string;
  approxReps: string;
  emptyTimeline: string;
  paletteTitle: string;
  createCustom: string;
  catAll: string;
  catBasic: string;
  catCombo: string;
  catCounter: string;
  catRest: string;
  previewFull: string;
  stopPreview: string;
  startWorkout: string;
  resetRoutineTitle: string;
  resetRoutineConfirm: string;
  reset: string;

  // New Combo Builder Wireframe Tabs & Actions
  tabBasics: string;
  tabPresetCombos: string;
  tabDailyPresets: string;
  tabMyCombos: string;
  dailyPresetTitle: string;
  loadTodayPreset: string;
  applyDayPreset: string;
  applyAllCombos: string;
  todayBadge: string;
  presetLoadedToast: string;
  saveToMyCombos: string;
  selectedDetailBreakdown: string;
  previewComboAudio: string;
  saveComboModalTitle: string;
  saveComboModalDesc: string;
  comboNamePlaceholder: string;
  deleteComboTitle: string;
  deleteComboConfirm: string;
  comboBadgeBasic: string;
  comboBadgeCombo: string;
  emptyMyCombos: string;
  selectComboColor: string;

  // Custom Combo Modal
  customModalTitle: string;
  customModalDesc: string;
  customNamePlaceholder: string;
  customPatternPlaceholder: string;
  previewLabel: string;
  estimatedDuration: string;
  addToRoutine: string;

  // Audio Workout Screen
  remainingTime: string;
  loopRound: string;
  totalStrikes: string;
  waiting: string;
  nextLoopWait: string;
  executeComboPrompt: string;
  listenComboPrompt: string;
  nextComboWaiting: string;
  workoutComplete: string;
  workoutCompleteDesc: string;
  totalTime: string;
  totalStrikesCount: string;
  approxCalories: string;
  retryWorkout: string;
  done: string;

  // History / Explore Screen
  historyTitle: string;
  totalSessions: string;
  totalSetsCompleted: string;
  totalTrainingTime: string;
  workoutLogs: string;
  noWorkoutLogs: string;
  clearHistory: string;
  clearHistoryConfirmTitle: string;
  clearHistoryConfirmDesc: string;
  clearDone: string;

  // Actions & Punches
  actionJab: string;
  actionStraight: string;
  actionLeftHook: string;
  actionRightHook: string;
  actionLeftUppercut: string;
  actionRightUppercut: string;
  actionLeftBody: string;
  actionRightBody: string;
  actionLeftSlip: string;
  actionRightSlip: string;
  actionDucking: string;
  actionWeave: string;
  actionRest: string;

  // Workbench Card & Navigation
  moveForward: string;
  moveBackward: string;

  // Video Timeline Bar
  timelineMultiTrack: string;
  playAllCombo: string;

  // Inspector & Alerts
  noSelectionGuide: string;
  notice: string;
  success: string;
  error: string;
  failedSaveCombo: string;
  tapToReturnWorkout: string;
  restBeat: string;

  // Home Playlist & Workout Integration
  workoutPlaylist: string;
  modeSequential: string;
  modeRandom: string;
  addCombo: string;
  selectCombosModalTitle: string;
  emptyPlaylist: string;
  startComboWorkout: string;
  freeWorkoutOnly: string;
  clearPlaylist: string;
  selectedCount: string;

  // Active Workout Screen & Notifications
  statePrepare: string;
  stateWork: string;
  stateRest: string;
  stateFinished: string;
  workoutLabel: string;
  freeWorkoutTimer: string;
  comboRoutineWorkout: string;
  allCombos: string;
  setUnit: string;
  strikesUnit: string;
  restTitle: string;
  restDesc: string;
  prepareTitle: string;
  prepareDescCombo: string;
  prepareDescDrill: string;
  prepareDescFree: string;
  demoSpeedControl: string;
  comboNextWait: string;
  restBeatShort: string;
  btnQuit: string;
  btnSkip: string;
  returnToDashboard: string;
  workoutFinishedTitle: string;
  workoutFinishedSubtitle: string;
  completedSets: string;
  totalWorkoutTime: string;
  savingLogStatus: string;
  quitConfirmTitle: string;
  quitConfirmMessage: string;
  quitConfirmKeepWorking: string;
  quitConfirmQuit: string;

  // Entitlements & Monetization
  tokenLimitTitle: string;
  tokenLimitMessage: string;
  tokenLimitProMessage: string;
  tokenLimitUltimateMessage: string;
  maxCombosLimitTitle: string;
  maxCombosLimitMessage: string;
  upgradeToPro: string;
  upgrade: string;
  proBadge: string;
  freeBadge: string;
  tokensUnit: string;

  // Banner Ad & Paywall
  bannerAdTitle: string;
  bannerAdDesc: string;
  paywallTitle: string;
  paywallSubtitle: string;
  proPassTitle: string;
  proPassDesc: string;
  proPassPrice: string;
  currentPlan: string;
  mostPopular: string;
  activeNow: string;
  includedInUltimate: string;
  ultimatePassTitle: string;
  ultimatePassDesc: string;
  ultimatePassPrice: string;
  vipBestBenefit: string;
  activeVipBadge: string;
  highestTierActive: string;
  promoUnlockTitle: string;
  promoUnlockDesc: string;

  // Auth & Guard
  authRequiredTitle: string;
  authRequiredDesc: string;
  fastAuthTitle: string;
  fastAuthDesc: string;
  termsAgreement: string;
  logoutSuccessTitle: string;
  logoutSuccessMessage: string;
  logoutConfirmTitle: string;
  logoutConfirmText: string;

  // Profile & Settings
  tierTitleUltimate: string;
  tierTitlePro: string;
  tierTitleFree: string;
  upgradeVip: string;
  unlockPass: string;
  maxTokensPerCombo: string;
  customCombosStorage: string;
  adFreeFeature: string;
  adFree100: string;
  adFreeEnabled: string;
  vipAnalytics: string;
  vipAnalyticsUnlocked: string;
  vipOnly: string;
  unlimited: string;
  minutesShort: string;
  secondsShort: string;
  devSwitchTier: string;
  guideWorkoutTips: string;
  profileGuardDesc: string;
  profileHeaderSubtitle: string;
  defaultMasterName: string;

  // History & Stats
  deleteLogConfirmTitle: string;
  deleteLogConfirmText: string;
  historyGuardDesc: string;
  vipAnalyticsHeader: string;
  totalPunches: string;
  totalEvasions: string;
  caloriesBurned: string;
  unlockVipAnalyticsCTA: string;
  punchUnit: string;
  evasionUnit: string;
  clearAll: string;

  // Inquiry
  inquiryEnterTitle: string;
  inquiryEnterContent: string;
  inquirySubmittedTitle: string;
  inquiryFailedTitle: string;
  inquiryFailedConnection: string;
  inquiryThankYou: string;
  inquirySubmitAnother: string;
  inquiryReturnHome: string;
  inquiryHeaderHelp: string;
  inquiryLabelEmail: string;
  inquiryOptional: string;
  inquiryLabelTitle: string;
  inquiryLabelContent: string;
  inquirySending: string;

  // Presets & Guide
  dailyCourseTitle: string;
  coreFocusArea: string;
  routineSequence: string;
  roundsUnit: string;
  startDayCourse: string;
  dayPresetApplied: string;
  invalidWorkoutTime: string;
  invalidRestTime: string;
  appGuideFaq: string;
  routineCombosCount: string;
  totalCombosCount: string;
}

export const translations: Record<Language, Translations> = {
  ko: {
    // Tabs & Navigation
    tabHome: '홈',
    tabRoutine: '빌더',
    tabHistory: '기록',
    tabProfile: '내 정보',

    // Header & Settings
    appTitle: '셋업 복싱',
    appSubtitle: '음성 콤보 코칭 & 콤보 빌더',
    settingsTitle: '운동 세팅 설정',
    workoutTime: '운동 시간',
    restTime: '휴식 시간',
    setsCount: '세트 수',
    demoSpeed: '시연 속도',
    save: '저장',
    delete: '삭제',
    cancel: '취소',
    close: '닫기',
    language: '언어 (Language)',
    languageName: '한국어',
    loginTitle: '로그인 / 회원가입',
    loginSubtitle: '기록 저장 및 나만의 콤보 동기화',
    loginSuccess: '로그인 성공',
    welcomeUser: '{name}님 환영합니다!',
    processingGoogleLogin: '구글 로그인 처리 중...',
    processingKakaoLogin: '카카오 로그인 처리 중...',
    pleaseWait: '잠시만 기다려주세요.',
    userMember: '회원',
    kakaoLogin: '카카오로 시작하기',
    googleLogin: '구글로 시작하기',
    guestLogin: '게스트로 둘러보기',
    logout: '로그아웃',
    inquiryTitle: '고객 문의하기',
    inquirySubtitle: '서비스 이용 중 불편한 점이나 건의사항을 남겨주세요.',
    inquiryCategory: '문의 유형',
    inquiryCategoryBug: '버그 제보 / 오류',
    inquiryCategoryFeature: '기능 제안 / 아이디어',
    inquiryCategoryPayment: '결제 / 구독 / 환불',
    inquiryCategoryAccount: '계정 / 로그인',
    inquiryCategoryGeneral: '기타 일반 문의',
    inquiryTitlePlaceholder: '문의 제목을 입력해주세요.',
    inquiryContentPlaceholder: '상세한 문의 내용을 작성해주세요.',
    inquiryEmailPlaceholder: '답변받으실 이메일 주소 (선택)',
    inquirySubmit: '문의 접수하기',
    inquirySuccess: '문의가 성공적으로 접수되었습니다. 소중한 의견 감사합니다!',

    // Home Screen
    todayStats: '오늘의 훈련 통계',
    todayWorkouts: '운동 횟수',
    todaySets: '총 세트 완료',
    freeWorkoutStart: '타이머 시작',
    comboRoutineTitle: '음성 콤보 코칭 & 콤보 빌더',
    comboRoutineDesc: '원-투, 바디, 카운터 블럭을 조립해 무한루프 음성 훈련 시작',
    newBadge: 'NEW',
    configWorkout: '운동',
    configRest: '휴식',
    configSets: '세트',

    // Routine Builder Screen
    builderTitle: '콤보 세팅 빌더',
    builderSubtitle: '하단 기술/콤보 패널에서 클릭하여 상단 콤보 세팅에 조립하세요',
    targetWorkoutTime: '목표 훈련 시간',
    tempoSpeed: '템포 (비트 속도)',
    tempoFast: '빠름 (0.55s)',
    tempoNormal: '보통 (0.7s)',
    tempoSlow: '느림 (0.85s)',
    timelineTitle: '콤보 세팅',
    singleCycle: '1회 순환',
    approxReps: '약 {count}회 반복',
    emptyTimeline: '하단 패널에서 기본/콤보 기술을 눌러 조립하세요!',
    paletteTitle: '기술 패널',
    createCustom: '직접 만들기',
    catAll: '전체',
    catBasic: '기본기',
    catCombo: '콤비네이션',
    catCounter: '바디 & 회피',
    catRest: '호흡(쉼)',
    previewFull: '1회 미리듣기',
    stopPreview: '정지',
    startWorkout: '훈련 시작 ({mins}분 무한루프)',
    resetRoutineTitle: '작업대 초기화',
    resetRoutineConfirm: '상단 작업대의 구성 요소를 모두 비우시겠습니까?',
    reset: '초기화',

    // New Combo Builder Wireframe Tabs & Actions
    tabBasics: '기본',
    tabPresetCombos: '기본 콤보',
    tabDailyPresets: '요일별 프리셋',
    tabMyCombos: '내 콤보',
    dailyPresetTitle: '요일별 맞춤 프리셋 코스',
    loadTodayPreset: '오늘 프리셋 불러오기',
    applyDayPreset: '이 요일 루틴 적용',
    applyAllCombos: '전체 담기',
    todayBadge: '오늘',
    presetLoadedToast: '오늘의 추천 프리셋 루틴이 플레이리스트에 적용되었습니다.',
    saveToMyCombos: '콤보 저장',
    selectedDetailBreakdown: '콤보 구성',
    previewComboAudio: '음성 듣기',
    saveComboModalTitle: '내 콤보로 저장',
    saveComboModalDesc: '현재 작업대의 세팅 구성을 내 콤보 패널에 저장합니다.',
    comboNamePlaceholder: '콤보 이름 (예: 내 콤보 1)',
    deleteComboTitle: '콤보 삭제',
    deleteComboConfirm: '이 콤보를 삭제하시겠습니까?',
    comboBadgeBasic: '기본',
    comboBadgeCombo: '콤보',
    emptyMyCombos: '저장된 내 콤보가 없습니다. 상단에서 조립 후 내 콤보에 저장해보세요!',
    selectComboColor: '콤보 색상 선택',

    // Custom Combo Modal
    customModalTitle: '새 커스텀 콤보 블럭',
    customModalDesc: '점(.)으로 구분하여 1~12 번호나 쉼(-)을 입력하세요.\n예시: 1.2.-.3 또는 1.1.2',
    customNamePlaceholder: '블럭 이름 (예: 1-2-3 콤보)',
    customPatternPlaceholder: '패턴 (예: 1.2.-.3)',
    previewLabel: '미리보기:',
    estimatedDuration: '소요 시간:',
    addToRoutine: '루틴에 추가',

    // Audio Workout Screen
    remainingTime: '남은 훈련 시간',
    loopRound: '루틴 순환 {count}회차',
    totalStrikes: '타격',
    waiting: '준비',
    nextLoopWait: '다음 세트 대기',
    executeComboPrompt: '🥊 콤보 따라하기! (실행)',
    listenComboPrompt: '🎧 코치 음성 듣는 중...',
    nextComboWaiting: '다음 콤보 준비',
    workoutComplete: '훈련 완료!',
    workoutCompleteDesc: '설정한 콤보 무한 반복 훈련을 완주하셨습니다! 🥊',
    totalTime: '총 훈련 시간',
    totalStrikesCount: '총 타격 횟수',
    approxCalories: '추정 칼로리',
    retryWorkout: '다시 훈련하기',
    done: '완료',

    // History / Explore Screen
    historyTitle: '운동 기록 리포트',
    totalSessions: '총 세션 횟수',
    totalSetsCompleted: '누적 완료 세트',
    totalTrainingTime: '총 훈련 시간',
    workoutLogs: '최근 훈련 기록 목록',
    noWorkoutLogs: '아직 완료된 훈련 기록이 없습니다.\n루틴 빌더에서 훈련을 시작해보세요!',
    clearHistory: '전체 기록 초기화',
    clearHistoryConfirmTitle: '데이터 초기화',
    clearHistoryConfirmDesc: '정말로 모든 운동 기록을 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
    clearDone: '데이터가 초기화되었습니다.',

    // Actions & Punches
    actionJab: '잽',
    actionStraight: '스트레이트 (투)',
    actionLeftHook: '왼손 훅',
    actionRightHook: '오른손 훅',
    actionLeftUppercut: '왼손 어퍼컷',
    actionRightUppercut: '오른손 어퍼컷',
    actionLeftBody: '왼손 바디샷',
    actionRightBody: '오른손 바디샷',
    actionLeftSlip: '왼쪽 슬립',
    actionRightSlip: '오른쪽 슬립',
    actionDucking: '더킹',
    actionWeave: '위빙',
    actionRest: '실행',

    // Workbench Card & Navigation
    moveForward: '앞으로',
    moveBackward: '뒤로',

    // Video Timeline Bar
    timelineMultiTrack: '타임라인',
    playAllCombo: '전체 재생',

    // Inspector & Alerts
    noSelectionGuide: '선택한 콤보 구성을 확인할 수 있습니다.',
    notice: '알림',
    success: '성공',
    error: '오류',
    failedSaveCombo: '콤보를 데이터베이스에 저장하지 못했습니다.',
    tapToReturnWorkout: '터치하여 훈련 복귀',
    restBeat: '실행',

    // Home Playlist & Workout Integration
    workoutPlaylist: '플레이리스트',
    modeSequential: '순차 반복',
    modeRandom: '랜덤',
    addCombo: '콤보 추가',
    selectCombosModalTitle: '플레이리스트에 콤보 담기',
    emptyPlaylist: '선택된 콤보가 없습니다. 콤보를 추가하거나 자유 운동을 진행하세요.',
    startComboWorkout: '훈련 시작',
    freeWorkoutOnly: '자유 운동 (벨만)',
    clearPlaylist: '비우기',
    selectedCount: '{count}개 콤보',

    // Active Workout Screen & Notifications
    statePrepare: '준비',
    stateWork: '운동',
    stateRest: '휴식',
    stateFinished: '완료!',
    workoutLabel: '훈련',
    freeWorkoutTimer: '자유 복싱 타이머',
    comboRoutineWorkout: '콤보 루틴 훈련',
    allCombos: '전체 콤보',
    setUnit: '세트',
    strikesUnit: '타격',
    restTitle: '숨을 고르세요',
    restDesc: '가드를 올리고 가볍게 제자리 스텝을 뛰며 대기하세요.',
    prepareTitle: '기본 자세 잡기',
    prepareDescCombo: '5초 후 1세트 콤보 훈련이 시작됩니다. 가드를 올리세요!',
    prepareDescDrill: '드릴 가이드를 보며 기술을 따라할 준비를 하세요.',
    prepareDescFree: '5초 후 자유 훈련을 시작합니다.',
    demoSpeedControl: '시연 속도 조절',
    comboNextWait: '다음 콤보 대기',
    restBeatShort: '실행',
    btnQuit: '종료',
    btnSkip: '스킵',
    returnToDashboard: '대시보드로 돌아가기',
    workoutFinishedTitle: '훈련 완료!',
    workoutFinishedSubtitle: '오늘 한 걸음 더 강해졌습니다. 🥊',
    completedSets: '완료 세트',
    totalWorkoutTime: '총 운동 시간',
    savingLogStatus: '기록 저장 중...',
    quitConfirmTitle: '훈련 중단',
    quitConfirmMessage: '정말로 운동을 중단하시겠습니까? 지금까지 완료한 세트 기록이 유실될 수 있습니다.',
    quitConfirmKeepWorking: '계속 운동하기',
    quitConfirmQuit: '종료하기',

    // Entitlements & Monetization
    tokenLimitTitle: '토큰 한도 초과',
    tokenLimitMessage: '현재 등급에서는 한 콤보에 최대 {max}개 토큰까지만 추가할 수 있습니다. (PRO 회원은 최대 {proMax}개, ULTIMATE 회원은 최대 {ultMax}개)',
    tokenLimitProMessage: 'PRO 등급에서는 한 콤보에 최대 {max}개 토큰까지만 추가할 수 있습니다. (ULTIMATE 회원은 최대 {ultMax}개)',
    tokenLimitUltimateMessage: 'ULTIMATE 등급에서는 한 콤보에 최대 {max}개 토큰까지 추가할 수 있습니다.',
    maxCombosLimitTitle: '콤보 저장 한도 도달',
    maxCombosLimitMessage: '무료 버전에서는 최대 {max}개의 콤보만 저장할 수 있습니다. PRO 업그레이드 시 무제한 저장이 가능합니다.',
    upgradeToPro: 'PRO 혜택 보기',
    upgrade: '업그레이드',
    proBadge: 'PRO',
    freeBadge: 'FREE',
    tokensUnit: '토큰',

    // Banner Ad & Paywall
    bannerAdTitle: '🥊 PRO로 업그레이드하고 광고 없이 훈련하세요!',
    bannerAdDesc: '콤보 40토큰 확장 + 무제한 콤보 저장',
    paywallTitle: '구독 없는 영구 소장 멤버십',
    paywallSubtitle: '매달 빠져나가는 구독 없이, 한 번 결제로 평생 무제한 훈련하세요.',
    proPassTitle: '🥊 PRO 패스 (영구 소장)',
    proPassDesc: '3,900원 / 단 한 번 결제',
    proPassPrice: '₩3,900',
    currentPlan: '✓ 이용 중인 플랜',
    mostPopular: '🔥 가장 인기',
    activeNow: '현재 활성화됨',
    includedInUltimate: 'ULTIMATE에 포함됨',
    ultimatePassTitle: '👑 ULTIMATE VIP 패스',
    ultimatePassDesc: '8,900원 / 펀치·회피 분석 & 개발자의 큰행복',
    ultimatePassPrice: '₩8,900',
    vipBestBenefit: '👑 VIP 최고혜택',
    activeVipBadge: '✓ VIP 이용 중',
    highestTierActive: '최고 등급 활성화됨',
    promoUnlockTitle: '🎉 프로모션 무료 해금',
    promoUnlockDesc: '무료 프로모션 이벤트 혜택으로 모든 기능이 해금되었습니다!',

    // Auth & Guard
    authRequiredTitle: '로그인 후 이용 가능합니다',
    authRequiredDesc: '나만의 맞춤형 콤보 제작 및 훈련 기록 저장을 이용하려면 로그인이 필요합니다.',
    fastAuthTitle: '간편 로그인',
    fastAuthDesc: '나만의 콤보 루틴 및 훈련 기록 저장을 위해 로그인하세요.',
    termsAgreement: '로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.',
    logoutSuccessTitle: '로그아웃 완료',
    logoutSuccessMessage: '성공적으로 로그아웃되었습니다.',
    logoutConfirmTitle: '로그아웃',
    logoutConfirmText: '정말 로그아웃 하시겠습니까?',

    // Profile & Settings
    tierTitleUltimate: '👑 ULTIMATE VIP 멤버',
    tierTitlePro: '🥊 PRO 멤버',
    tierTitleFree: 'FREE 무료 회원',
    upgradeVip: 'VIP 업그레이드',
    unlockPass: '멤버십 해금',
    maxTokensPerCombo: '콤보당 최대 토큰',
    customCombosStorage: '나만의 콤보 저장',
    adFreeFeature: '광고 제거',
    adFree100: '✓ 100% 영구 제거',
    adFreeEnabled: '기본 광고 노출',
    vipAnalytics: '정밀 분석 리포트',
    vipAnalyticsUnlocked: '👑 펀치/회피/칼로리 해금',
    vipOnly: 'VIP 전용',
    unlimited: '무제한',
    minutesShort: '분',
    secondsShort: '초',
    devSwitchTier: '🧪 [개발/테스트] 멤버십 등급 전환',
    guideWorkoutTips: '트레이닝 꿀팁 가이드',
    profileGuardDesc: '계정 정보 및 멤버십 패스를 관리하려면 로그인이 필요합니다.',
    profileHeaderSubtitle: '계정 및 멤버십 패스 관리',
    defaultMasterName: '복싱 마스터',

    // History & Stats
    deleteLogConfirmTitle: '기록 삭제',
    deleteLogConfirmText: '이 운동 기록을 삭제하시겠습니까?',
    historyGuardDesc: '운동 기록 관리 및 통계 분석을 확인하려면 로그인이 필요합니다.',
    vipAnalyticsHeader: 'VIP 트레이닝 통계 분석',
    totalPunches: '총 펀치 수',
    totalEvasions: '총 회피 수',
    caloriesBurned: '소모 칼로리',
    unlockVipAnalyticsCTA: 'VIP 정밀 트레이닝 분석 해금하기',
    punchUnit: '펀치',
    evasionUnit: '회피',
    clearAll: '전체 삭제',

    // Inquiry
    inquiryEnterTitle: '문의 제목을 입력해주세요.',
    inquiryEnterContent: '상세한 문의 내용을 입력해주세요.',
    inquirySubmittedTitle: '전송 완료',
    inquiryFailedTitle: '전송 실패',
    inquiryFailedConnection: '서버 통신에 실패했습니다.',
    inquiryThankYou: '문의가 접수되었습니다!',
    inquirySubmitAnother: '추가 문의 접수',
    inquiryReturnHome: '홈으로 돌아가기',
    inquiryHeaderHelp: '1:1 고객 문의 / 제안 접수',
    inquiryLabelEmail: '이메일 주소',
    inquiryOptional: '답변 알림용, 선택',
    inquiryLabelTitle: '문의 제목',
    inquiryLabelContent: '문의 내용',
    inquirySending: '전송 중...',

    // Presets & Guide
    dailyCourseTitle: '요일별 맞춤 트레이닝',
    coreFocusArea: '오늘의 집중 훈련 포인트:',
    routineSequence: '포함된 콤보 시퀀스:',
    roundsUnit: '라운드',
    startDayCourse: '{dayName} 코스 훈련 시작 ({mins}분 × {sets}R)',
    dayPresetApplied: '{dayName} 요일 프리셋 적용 완료',
    invalidWorkoutTime: '운동 시간을 확인하세요.',
    invalidRestTime: '휴식 시간을 확인하세요.',
    appGuideFaq: '앱 소개 및 가이드',
    routineCombosCount: '루틴 포함 콤보 (세트 내 순차 반복):',
    totalCombosCount: '{count}개 콤보 구성',
  },
  en: {
    // Tabs & Navigation
    tabHome: 'Home',
    tabRoutine: 'Builder',
    tabHistory: 'History',
    tabProfile: 'Profile',

    // Header & Settings
    appTitle: 'Setup Boxing',
    appSubtitle: 'Voice Coaching & Combo Builder',
    settingsTitle: 'Workout Settings',
    workoutTime: 'Workout Duration',
    restTime: 'Rest Duration',
    setsCount: 'Number of Sets',
    demoSpeed: 'Demo Speed',
    save: 'Save',
    delete: 'Delete',
    cancel: 'Cancel',
    close: 'Close',
    language: 'Language',
    languageName: 'English',
    loginTitle: 'Login / Sign Up',
    loginSubtitle: 'Save workout history & sync combos',
    loginSuccess: 'Login Successful',
    welcomeUser: 'Welcome, {name}!',
    processingGoogleLogin: 'Processing Google login...',
    processingKakaoLogin: 'Processing Kakao login...',
    pleaseWait: 'Please wait a moment.',
    userMember: 'Member',
    kakaoLogin: 'Continue with Kakao',
    googleLogin: 'Continue with Google',
    guestLogin: 'Browse as Guest',
    logout: 'Log Out',
    inquiryTitle: 'Contact Us',
    inquirySubtitle: 'Send us your questions, feedback, or feature requests.',
    inquiryCategory: 'Inquiry Category',
    inquiryCategoryBug: 'Bug Report / Error',
    inquiryCategoryFeature: 'Feature Request / Idea',
    inquiryCategoryPayment: 'Payment & Subscription',
    inquiryCategoryAccount: 'Account & Login',
    inquiryCategoryGeneral: 'General Inquiry',
    inquiryTitlePlaceholder: 'Enter inquiry title...',
    inquiryContentPlaceholder: 'Please describe your inquiry or feedback in detail...',
    inquiryEmailPlaceholder: 'Email for reply (optional)',
    inquirySubmit: 'Submit Inquiry',
    inquirySuccess: 'Your inquiry has been submitted successfully. Thank you for your feedback!',

    // Home Screen
    todayStats: "Today's Stats",
    todayWorkouts: 'Workouts',
    todaySets: 'Total Sets Completed',
    freeWorkoutStart: 'Start Timer',
    comboRoutineTitle: 'Voice Combo Coach & Combo Builder',
    comboRoutineDesc: 'Build 1-2, Body, Counter blocks for infinite loop audio coaching',
    newBadge: 'NEW',
    configWorkout: 'Work',
    configRest: 'Rest',
    configSets: 'Sets',

    // Routine Builder Screen
    builderTitle: 'Combo Builder',
    builderSubtitle: 'Tap basic moves / combos from the bottom panel to assemble on top combo setting',
    targetWorkoutTime: 'Target Workout Time',
    tempoSpeed: 'Tempo (Beat Speed)',
    tempoFast: 'Fast (0.55s)',
    tempoNormal: 'Normal (0.7s)',
    tempoSlow: 'Slow (0.85s)',
    timelineTitle: 'Combo Setting',
    singleCycle: '1 Cycle',
    approxReps: '~{count} reps',
    emptyTimeline: 'Tap elements in the bottom panel to append to the workbench!',
    paletteTitle: 'Skill Panel',
    createCustom: 'Custom Combo',
    catAll: 'All',
    catBasic: 'Basics',
    catCombo: 'Combinations',
    catCounter: 'Body & Defense',
    catRest: 'Rest',
    previewFull: 'Listen 1x',
    stopPreview: 'Stop',
    startWorkout: 'Start Workout ({mins}m Loop)',
    resetRoutineTitle: 'Clear Workbench',
    resetRoutineConfirm: 'Clear all elements from the top workbench?',
    reset: 'Clear',

    // New Combo Builder Wireframe Tabs & Actions
    tabBasics: 'Basics',
    tabPresetCombos: 'Preset Combos',
    tabDailyPresets: 'Daily Presets',
    tabMyCombos: 'My Combos',
    dailyPresetTitle: 'Daily Boxing Preset Courses',
    loadTodayPreset: "Load Today's Preset",
    applyDayPreset: 'Apply Routine',
    applyAllCombos: 'Add All',
    todayBadge: 'TODAY',
    presetLoadedToast: "Today's daily preset loaded into your playlist.",
    saveToMyCombos: 'Save Combos',
    selectedDetailBreakdown: 'Selected Combo',
    previewComboAudio: 'Listen Audio',
    saveComboModalTitle: 'Save to My Combos',
    saveComboModalDesc: 'Save current workbench configuration as a reusable combo entry.',
    comboNamePlaceholder: 'Combo Name (e.g. My Combo 1)',
    deleteComboTitle: 'Delete Combo',
    deleteComboConfirm: 'Delete this combo entry?',
    comboBadgeBasic: 'Basic',
    comboBadgeCombo: 'Combo',
    emptyMyCombos: 'No saved combos yet. Assemble items above and save them here!',
    selectComboColor: 'Select Badge Color',

    // Custom Combo Modal
    customModalTitle: 'Create Custom Combo Block',
    customModalDesc: 'Enter dot-separated action numbers (1-12) or rest (-).\nExample: 1.2.-.3 or 1.1.2',
    customNamePlaceholder: 'Block Name (e.g. 1-2-3 Combo)',
    customPatternPlaceholder: 'Pattern (e.g. 1.2.-.3)',
    previewLabel: 'Preview:',
    estimatedDuration: 'Duration:',
    addToRoutine: 'Add to Routine',

    // Audio Workout Screen
    remainingTime: 'Remaining Time',
    loopRound: 'Loop #{count}',
    totalStrikes: 'Strikes',
    waiting: 'Get Ready',
    nextLoopWait: 'Resting before next loop',
    executeComboPrompt: '🥊 Execute Combo Now!',
    listenComboPrompt: '🎧 Listen to Coach...',
    nextComboWaiting: 'Get Ready for Next Combo',
    workoutComplete: 'Workout Complete!',
    workoutCompleteDesc: 'You finished the infinite audio combo routine! 🥊',
    totalTime: 'Total Duration',
    totalStrikesCount: 'Total Strikes',
    approxCalories: 'Est. Calories',
    retryWorkout: 'Train Again',
    done: 'Done',

    // History / Explore Screen
    historyTitle: 'Workout History & Reports',
    totalSessions: 'Total Sessions',
    totalSetsCompleted: 'Cumulative Sets',
    totalTrainingTime: 'Total Training Time',
    workoutLogs: 'Recent Workout Logs',
    noWorkoutLogs: 'No workout history recorded yet.\nStart a routine from the Routine Builder!',
    clearHistory: 'Clear History',
    clearHistoryConfirmTitle: 'Reset Data',
    clearHistoryConfirmDesc: 'Are you sure you want to delete all workout history? This action cannot be undone.',
    clearDone: 'All workout history has been cleared.',

    // Actions & Punches
    actionJab: 'Jab',
    actionStraight: 'Straight (Cross)',
    actionLeftHook: 'Left Hook',
    actionRightHook: 'Right Hook',
    actionLeftUppercut: 'Left Uppercut',
    actionRightUppercut: 'Right Uppercut',
    actionLeftBody: 'Left Body Shot',
    actionRightBody: 'Right Body Shot',
    actionLeftSlip: 'Left Slip',
    actionRightSlip: 'Right Slip',
    actionDucking: 'Ducking',
    actionWeave: 'Weaving',
    actionRest: 'Do',

    // Workbench Card & Navigation
    moveForward: 'Prev',
    moveBackward: 'Next',

    // Video Timeline Bar
    timelineMultiTrack: 'Timeline',
    playAllCombo: 'Play All',

    // Inspector & Alerts
    noSelectionGuide: 'You can check the selected combo configuration.',
    notice: 'Notice',
    success: 'Success',
    error: 'Error',
    failedSaveCombo: 'Failed to save combo to database.',
    tapToReturnWorkout: 'Tap to return to workout',
    restBeat: 'Do',

    // Home Playlist & Workout Integration
    workoutPlaylist: 'Playlist',
    modeSequential: 'Sequential',
    modeRandom: 'Random',
    addCombo: 'Add Combo',
    selectCombosModalTitle: 'Add Combos to Playlist',
    emptyPlaylist: 'No combos selected. Add combos or start a free workout.',
    startComboWorkout: 'Start Workout',
    freeWorkoutOnly: 'Free Workout (Bell Only)',
    clearPlaylist: 'Clear All',
    selectedCount: '{count} Combos',

    // Active Workout Screen & Notifications
    statePrepare: 'PREPARE',
    stateWork: 'WORK',
    stateRest: 'REST',
    stateFinished: 'FINISHED',
    workoutLabel: 'Workout',
    freeWorkoutTimer: 'Free Boxing Timer',
    comboRoutineWorkout: 'Combo Routine Workout',
    allCombos: 'All Combos',
    setUnit: 'Sets',
    strikesUnit: 'Strikes',
    restTitle: 'Catch Your Breath',
    restDesc: 'Keep your guard up and step lightly in place while resting.',
    prepareTitle: 'Get Into Stance',
    prepareDescCombo: 'Set 1 combo workout starts in 5s. Hands up!',
    prepareDescDrill: 'Watch the drill guide and get ready to follow along.',
    prepareDescFree: 'Free workout starts in 5 seconds.',
    demoSpeedControl: 'Demo Speed Control',
    comboNextWait: 'Waiting for next combo',
    restBeatShort: 'Do',
    btnQuit: 'Quit',
    btnSkip: 'Skip',
    returnToDashboard: 'Return to Dashboard',
    workoutFinishedTitle: 'Workout Complete!',
    workoutFinishedSubtitle: 'You took another step to get stronger today. 🥊',
    completedSets: 'Completed Sets',
    totalWorkoutTime: 'Total Workout Time',
    savingLogStatus: 'Saving workout log...',
    quitConfirmTitle: 'Quit Workout',
    quitConfirmMessage: 'Are you sure you want to stop the workout? Current set progress may be lost.',
    quitConfirmKeepWorking: 'Keep Working',
    quitConfirmQuit: 'Quit',

    // Entitlements & Monetization
    tokenLimitTitle: 'Token Limit Exceeded',
    tokenLimitMessage: 'Your current tier allows up to {max} tokens per combo. (PRO: up to {proMax} tokens, ULTIMATE: up to {ultMax} tokens)',
    tokenLimitProMessage: 'PRO tier allows up to {max} tokens per combo. (ULTIMATE members can add up to {ultMax} tokens)',
    tokenLimitUltimateMessage: 'ULTIMATE tier allows up to {max} tokens per combo.',
    maxCombosLimitTitle: 'Combo Limit Reached',
    maxCombosLimitMessage: 'You can save up to {max} custom combos in the free tier. Upgrade to PRO for unlimited combos.',
    upgradeToPro: 'View PRO',
    upgrade: 'Upgrade',
    proBadge: 'PRO',
    freeBadge: 'FREE',
    tokensUnit: 'Tokens',

    // Banner Ad & Paywall
    bannerAdTitle: '🥊 Upgrade to PRO for 100% Ad-Free Workouts!',
    bannerAdDesc: 'Expand to 40 tokens + unlimited combos',
    paywallTitle: 'Pay Once, Own Forever',
    paywallSubtitle: 'No monthly subscriptions. One lifetime purchase for unlimited boxing.',
    proPassTitle: '🥊 PRO Pass (Lifetime)',
    proPassDesc: 'Only $2.99 / One-Time',
    proPassPrice: '$2.99',
    currentPlan: 'CURRENT PLAN',
    mostPopular: 'MOST POPULAR',
    activeNow: 'Currently Active',
    includedInUltimate: 'Included in ULTIMATE',
    ultimatePassTitle: '👑 ULTIMATE VIP Pass',
    ultimatePassDesc: "$6.99 / Analytics & Developer's Great Joy",
    ultimatePassPrice: '$6.99',
    vipBestBenefit: 'VIP ULTIMATE',
    activeVipBadge: 'ACTIVE VIP',
    highestTierActive: 'Highest Tier Active',
    promoUnlockTitle: '🎉 Promotion Unlocked',
    promoUnlockDesc: 'Status: All features unlocked for free via special promotional event!',

    // Auth & Guard
    authRequiredTitle: 'Sign In Required',
    authRequiredDesc: 'Sign in to create custom combos and save your training history.',
    fastAuthTitle: 'Sign In',
    fastAuthDesc: 'Sign in to manage your custom routines & training logs.',
    termsAgreement: 'By logging in, you agree to our Terms of Service & Privacy Policy.',
    logoutSuccessTitle: 'Logged Out',
    logoutSuccessMessage: 'Successfully logged out.',
    logoutConfirmTitle: 'Log Out',
    logoutConfirmText: 'Are you sure you want to log out?',

    // Profile & Settings
    tierTitleUltimate: '👑 ULTIMATE VIP Member',
    tierTitlePro: '🥊 PRO Member',
    tierTitleFree: 'FREE Member',
    upgradeVip: 'Upgrade VIP',
    unlockPass: 'Unlock Pass',
    maxTokensPerCombo: 'Max Tokens / Combo',
    customCombosStorage: 'Custom Combos',
    adFreeFeature: 'Ad-Free',
    adFree100: '✓ 100% Ad-Free',
    adFreeEnabled: 'Ads Enabled',
    vipAnalytics: 'VIP Analytics',
    vipAnalyticsUnlocked: 'Full Analytics Unlocked',
    vipOnly: 'VIP Only',
    unlimited: 'Unlimited',
    minutesShort: 'm',
    secondsShort: 's',
    devSwitchTier: '🧪 [Dev/Test] Switch Tier',
    guideWorkoutTips: 'Workout Guide & Tips',
    profileGuardDesc: 'Sign in to manage your account and membership passes.',
    profileHeaderSubtitle: 'Account & Membership Pass Management',
    defaultMasterName: 'Boxing Master',

    // History & Stats
    deleteLogConfirmTitle: 'Delete Log',
    deleteLogConfirmText: 'Delete this workout log?',
    historyGuardDesc: 'Sign in to view your workout logs and training analytics.',
    vipAnalyticsHeader: 'VIP Workout Analytics',
    totalPunches: 'Total Punches',
    totalEvasions: 'Total Evasions',
    caloriesBurned: 'Calories Burned',
    unlockVipAnalyticsCTA: 'Unlock VIP Analytics',
    punchUnit: 'punches',
    evasionUnit: 'evasions',
    clearAll: 'Clear All',

    // Inquiry
    inquiryEnterTitle: 'Please enter a title.',
    inquiryEnterContent: 'Please enter the content.',
    inquirySubmittedTitle: 'Inquiry Submitted',
    inquiryFailedTitle: 'Submission Failed',
    inquiryFailedConnection: 'Failed to connect to server.',
    inquiryThankYou: 'Thank You for Your Feedback!',
    inquirySubmitAnother: 'Submit Another Inquiry',
    inquiryReturnHome: 'Return to Home',
    inquiryHeaderHelp: '1:1 Support & Suggestions',
    inquiryLabelEmail: 'Email Address',
    inquiryOptional: 'Optional',
    inquiryLabelTitle: 'Subject',
    inquiryLabelContent: 'Message',
    inquirySending: 'Sending...',

    // Presets & Guide
    dailyCourseTitle: 'Daily Boxing Course',
    coreFocusArea: 'Core Focus Area:',
    routineSequence: 'Routine Sequence:',
    roundsUnit: 'Rounds',
    startDayCourse: 'Start {dayName} Routine ({mins}m × {sets}R)',
    dayPresetApplied: '{dayName} Preset Applied',
    invalidWorkoutTime: 'Invalid workout time.',
    invalidRestTime: 'Invalid rest time.',
    appGuideFaq: 'App Guide & FAQ',
    routineCombosCount: 'Included Routine Combos:',
    totalCombosCount: '{count} combos',
  },
};
