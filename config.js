/**
 * ====================================================================
 * CẤU HÌNH THẾ GIỚI CHIIKAWA (CHIIKAWA PIXEL WORLD CONFIG)
 * ====================================================================
 */

window.CHIIKAWA_CONFIG = {
  // Tiêu đề hiển thị trên góc trái Header
  appName: "Thế Giới Chiikawa",

  // Thông tin người chơi & ngày gia nhập thế giới Chiikawa
  player: {
    name: "Nhà Thám Hiểm Chiikawa",
    rank: "Cấp Độ 1 (Tân Binh)",
    startDate: "2024-01-01",
    signatureNote: "Nantoka Nare - Cùng nhau khám phá! ✨"
  },

  // Fallback an toàn cho hệ thống
  couple: {
    boyfriendName: "Hachiware",
    girlfriendName: "Chiikawa",
    nickname: "Nhà Thám Hiểm",
    startDate: "2024-01-01",
    signatureNote: "Nantoka Nare - Cùng nhau khám phá! ✨"
  },

  // Danh ngôn & Lời thoại ngộ nghĩnh của bộ ba Chiikawa
  quotes: {
    chiikawa: [
      "Chiikawa rung rinh: Wa... Wawa! (Chào mừng bạn đến với thế giới nhỏ!) 🤍",
      "Chiikawa mếu máo: Hu hu... vừa gặp quái vật bọ ngựa nhưng đã chạy thoát rồi!",
      "Chiikawa cười tít mắt: Mình nhặt được một quả dâu rừng to đùng tặng bạn nè!",
      "Chiikawa ôm chặt chiếc gối: Cùng ngủ một giấc thật êm ái nhé~ (⁠´⁠꒳⁠`⁠)",
      "Chiikawa giơ cuốn sách: Mình đang chăm chỉ ôn thi bằng nhổ cỏ cấp 5 á!",
      "Chiikawa reo vui: Chíp chíp! Hôm nay trời thật đẹp và mát mẻ!"
    ],
    hachiware: [
      "Hachiware dõng dạc: 'Nantoka nare!' - Cứ thử sức là sẽ có cách giải quyết thôi!",
      "Hachiware cười tươi: Mình vừa nấu một nồi súp nóng hổi trong hang động nè, ăn cùng tụi mình không?",
      "Hachiware giơ máy ảnh: 'Tách'! Bức ảnh lưu niệm tuyệt đẹp của tụi mình trên thảo nguyên!",
      "Hachiware gảy đàn: 'Hitorigottsu~' - Giai điệu mộc mạc tặng cho ngày mới của bạn!",
      "Hachiware nhắc nhở: Khi đi nhổ cỏ nhớ cẩn thận các loại cỏ độc nguy hiểm nha!",
      "Hachiware động viên: Bạn làm việc chăm chỉ lắm, tụi mình cùng cố gắng kiếm thật nhiều Xu nhé!"
    ],
    usagi: [
      "Usagi nhảy cẫng lên: YAHA!! URA URA URA!! HÚ HÉT VANG ĐỒI NÈE!!",
      "Usagi múa gậy phép: PULULULU~~ Bắn tia phép thuật lấp lánh xua tan mệt mỏi!!",
      "Usagi xoay vòng: HA? HA? Lăn lông lốc từ đỉnh đồi xuống thảm cỏ xanh thôi!!",
      "Usagi háu ăn: URAAA! Đói bụng rồi, cùng đi lùng sục cây kẹo khổng lồ nào!!",
      "Usagi nháy mắt: FUDIYAHA! Quẩy tưng bừng hết mình cùng thảo nguyên hôm nay!!",
      "Usagi rung hai tai: YAA-HAA! Tốc độ siêu âm lao vun vút vượt qua mọi thử thách!"
    ]
  },

  // Danh sách các quẻ bói may mắn Omikuji thảo nguyên
  loveFortunes: [
    { title: "Đại Cát May Mắn 🌟", text: "Hôm nay bạn sẽ nhặt được hạt dẻ khổng lồ và nhận được vô số niềm vui!" },
    { title: "Siêu Ngọt Ngào 🍮", text: "Tâm trạng hôm nay ngọt ngào như chiếc bánh pudding kem caramel béo ngậy!" },
    { title: "Bữa Tiệc Mì Ro- 🍜", text: "Dấu hiệu vũ trụ mách bảo hôm nay bạn nên thưởng thức một tô mì ramen nóng hổi!" },
    { title: "Năng Lượng Usagi ⚡", text: "Usagi ban cho bạn 200% sinh lực để hoàn thành mọi mục tiêu nhanh như chớp!" },
    { title: "Vượt Khó Nan-Toka-Nare 🛡️", text: "Dù gặp bất cứ chuyện gì, 'Nantoka nare' - mọi thứ rồi sẽ suôn sẻ và tốt đẹp!" },
    { title: "Bằng Cỏ Cấp 5 Xuất Sắc 📜", text: "Sự chăm chỉ và kiên trì hôm nay sẽ mang lại thành quả tuyệt vời cho bạn!" }
  ],

  // Các phần thưởng Gacha Bảo Bối Thảo Nguyên khi quay máy Gacha
  gachaRewards: [
    { name: "Gậy Phép Thuật Huyền Thoại", desc: "Vũ khí phát sáng kỳ diệu của Usagi xua tan mọi bóng tối! 🪄", rarity: "UR" },
    { name: "Bằng Nhổ Cỏ Cấp 1 Danh Dự", desc: "Chứng chỉ cấp cao nhất của Hiệp Hội Thám Hiểm Chiikawa! 📜", rarity: "UR" },
    { name: "Bát Mì Ro- Siêu To Khổng Lồ", desc: "Phần thưởng ẩm thực no nê được đầu bếp Ro- chế biến đặc biệt! 🍜", rarity: "SSR" },
    { name: "Máy Ảnh Cổ Điển Xanh Dương", desc: "Chiếc máy ảnh quý báu mà Hachiware đã tích góp mua được! 📷", rarity: "SSR" },
    { name: "Đàn Guitar Gỗ Của Hachiware", desc: "Cây đàn mộc dùng để gảy khúc ca Hitorigoto bất hủ! 🎸", rarity: "SR" },
    { name: "Hũ Kẹo Sao Rơi Lấp Lánh", desc: "Kẹo ngọt ngào rơi từ bầu trời đêm trên thảo nguyên kỳ diệu! 🍬", rarity: "SR" },
    { name: "Cây Nĩa Bạc Trừ Tà", desc: "Vũ khí chiến đấu dũng cảm bảo vệ thảo nguyên yên bình! 🍴", rarity: "R" },
    { name: "Bộ Tách Trà Hoa Cúc Mùa Thu", desc: "Bộ ấm chén xinh xắn để cùng bạn bè thưởng trà chiều thư giãn! ☕", rarity: "R" }
  ],

  // Bằng Chứng Nhận Kỳ Thi Nhổ Cỏ (草むしり検定)
  certificate: {
    title: "GIẤY CHỨNG NHẬN DŨNG SĨ",
    subtitle: "Hiệp Hội Thám Hiểm Chiikawa (草むしり検定)",
    rank: "CẤP ĐỘ 1 (CHỨNG CHỈ XUẤT SẮC)",
    officialText: "Chứng nhận cấp cho cá nhân đã hoàn thành xuất sắc các khóa huấn luyện: Chăm chỉ lao động nhổ sạch cỏ dại, dũng cảm đối đầu thảo phạt quái vật, luôn lạc quan kiên cường và hết lòng bảo vệ bạn bè trên thảo nguyên Chiikawa.",
    stampText: "HIỆP HỘI CHIIKAWA ĐÃ CẤP 💮"
  },

  // Danh sách các bức thư bí mật từ bóng bay / chim đưa thư
  loveNotes: [
    "💌 [Thư từ Hachiware]: 'Nantoka nare!' Hôm nay tụi mình cùng nhau cố gắng hoàn thành tốt công việc nha! (+3 Xu) 🪙",
    "💌 [Thư từ Usagi]: 'URA! YAHA! PULULU!' Usagi nhặt được món quà bí mật trên đồi thảo nguyên gửi tặng bạn! (+3 Xu) 🪙",
    "💌 [Thư từ Chiikawa]: 'Wawa...!' Chiikawa gửi tặng bạn một chiếc bánh quy hạt dẻ thơm lừng và ấm áp! (+3 Xu) 🪙",
    "💌 [Thư từ Bác Giáp Sĩ]: 'Làm tốt lắm nhà thám hiểm trẻ!' Đây là khoản thù lao khen thưởng đặc biệt cho bạn! (+3 Xu) 🪙",
    "💌 [Thư từ Bác Kurimanju]: 'Haaa~!' Một ly trà lúa mạch mát lạnh chúc bạn ngày mới thật sảng khoái và tràn đầy năng lượng! (+3 Xu) 🪙",
    "💌 [Thư từ Bé Momonga]: 'Khen tui đi mau lên!' Momonga gửi một chùm dâu rừng ngon ngọt cho bạn nè! (+3 Xu) 🪙",
    "💌 [Thư từ Rakko]: 'Hãy giữ vững tinh thần dũng sĩ!' Đừng ngần ngại đối mặt với mọi thử thách mới! (+3 Xu) 🪙",
    "💌 [Thư từ Trạm Bưu Điện Thảo Nguyên]: Chúc bạn một ngày khám phá tràn ngập niềm vui, may mắn và thu hoạch thật nhiều Xu! (+3 Xu) 🪙"
  ]
};
