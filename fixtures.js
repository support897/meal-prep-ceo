/* FIXTURE DATA: invented numbers and invented words only.
   Nothing here is a real user, a real review, or a real
   sale. Fixture mode exists so the gates can review the
   whole dashboard surface before the Meal Prep Firebase
   project exists. The UI watermarks every fixture render.
   Shapes follow CEO-DATA-CONTRACTS.md exactly, so the
   live reads and the fixture reads render through the
   same code. */
window.MP_FIXTURES = {
  aggregates: {
    signups: {
      total: 132,
      newThisWeek: 14,
      weeklySeries: [
        { week: "18 Aug", count: 4 },
        { week: "25 Aug", count: 7 },
        { week: "1 Sep", count: 9 },
        { week: "8 Sep", count: 12 },
        { week: "15 Sep", count: 16 },
        { week: "22 Sep", count: 21 },
        { week: "29 Sep", count: 27 },
        { week: "6 Oct", count: 36 }
      ]
    },
    people: {
      activated: 87,
      activationRate: 0.66,
      returning7d: 54
    },
    money: {
      currency: "AUD",
      paying: 23,
      pendingCancels: 2,
      endedCancels: 3,
      failedPayments: 1,
      mrrEstimateCents: 16077,
      netMovementCents: 2097,
      cancelReasons: [
        { reason: "Too busy to cook right now", status: "ended", week: "6 Oct" },
        { reason: "Trying a smaller plan first", status: "pending", week: "6 Oct" },
        { reason: "Moving house this month", status: "ended", week: "29 Sep" },
        { reason: "No reason given", status: "pending", week: "29 Sep" },
        { reason: "Pantry already full", status: "ended", week: "22 Sep" }
      ]
    }
  },
  reviews: {
    count: 9,
    unreplied: 2,
    strangerReplies: 3,
    inbox: [
      { platform: "App Store", rating: 5, title: "Sunday planning finally sticks", body: "The week fills itself and the shopping list writes itself. The allergy swaps for my daughter are the part I tell friends about.", author: "Store reviewer", date: "2026-10-11", replied: true },
      { platform: "Google Play", rating: 5, title: "Calm and clear", body: "No clutter, no noise. I open it, the week is there, dinner is sorted.", author: "Store reviewer", date: "2026-10-08", replied: true },
      { platform: "App Store", rating: 4, title: "Wish it had more slow cooker meals", body: "Love the planning. A few more set and forget dinners would make it perfect for winter.", author: "Store reviewer", date: "2026-10-03", replied: false },
      { platform: "Google Play", rating: 5, title: "The fridge photo trick is gold", body: "Snapped what was left in the fridge and it built meals around it. Less waste already.", author: "Store reviewer", date: "2026-09-27", replied: false }
    ]
  },
  outreach: {
    campaigns: []
  },
  groups: [
    { name: "Meal Prep Sundays Australia", members: 412, membersLastWeek: 389, postsThisWeek: 18, source: "manual" },
    { name: "Family Dinners, Sorted", members: 268, membersLastWeek: 261, postsThisWeek: 9, source: "manual" }
  ],
  avatarPieces: [
    { presenterId: "MP1", presenterName: "Mia", anchorSetVersion: "mia-anchors-v1", app: "Meal Prep", pieceId: "mp1-001", contentLine: "Sunday Reset: the week planned in one sitting", platform: "Instagram", date: "2026-10-12", views: 1840, watchRate: 0.62, sends: 41, saves: 96, salesCount: 3, salesAmountCents: 2097, currency: "AUD", disclosure: "y", aiLabel: "y", metadataZero: "y" },
    { presenterId: "MP1", presenterName: "Mia", anchorSetVersion: "mia-anchors-v1", app: "Meal Prep", pieceId: "mp1-002", contentLine: "Use It First Tuesday: the spinach goes in tonight", platform: "TikTok", date: "2026-10-07", views: 1295, watchRate: 0.58, sends: 22, saves: 51, salesCount: 1, salesAmountCents: 699, currency: "AUD", disclosure: "y", aiLabel: "y", metadataZero: "y" },
    { presenterId: "MP1", presenterName: "Mia", anchorSetVersion: "mia-anchors-v1", app: "Meal Prep", pieceId: "mp1-003", contentLine: "Allergy Swap Thursday: peanut out, sunflower in", platform: "Instagram", date: "2026-10-02", views: 1610, watchRate: 0.66, sends: 35, saves: 88, salesCount: null, salesAmountCents: null, currency: "AUD", disclosure: "y", aiLabel: "y", metadataZero: "y" },
    { presenterId: "MP2", presenterName: "Rosa", anchorSetVersion: "rosa-anchors-v1", app: "Meal Prep", pieceId: "mp2-001", contentLine: "A week of dinners for two, no waste", platform: "Facebook", date: "2026-10-10", views: 940, watchRate: 0.71, sends: 48, saves: 37, salesCount: 2, salesAmountCents: 1398, currency: "AUD", disclosure: "y", aiLabel: "y", metadataZero: "y" },
    { presenterId: "MP2", presenterName: "Rosa", anchorSetVersion: "rosa-anchors-v1", app: "Meal Prep", pieceId: "mp2-002", contentLine: "The soup that uses the whole crisper", platform: "Facebook", date: "2026-10-01", views: 705, watchRate: 0.64, sends: 29, saves: 21, salesCount: 0, salesAmountCents: 0, currency: "AUD", disclosure: "y", aiLabel: "y", metadataZero: "n" },
    { presenterId: "MP3", presenterName: "Jay", anchorSetVersion: "jay-anchors-v1", app: "Meal Prep", pieceId: "mp3-001", contentLine: "Batch cook Sunday, weeknights on easy mode", platform: "TikTok", date: "2026-10-09", views: 2210, watchRate: 0.55, sends: 18, saves: 64, salesCount: 2, salesAmountCents: 9998, currency: "AUD", disclosure: "y", aiLabel: "y", metadataZero: "y" }
  ]
};
