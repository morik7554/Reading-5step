import { mkdir, writeFile } from "node:fs/promises";
import { gradedDistractors, gradedMaterialOverrides } from "./graded-material-overrides.mjs";
import { schoolGradeOverrides } from "./school-grade-overrides.mjs";

const lessons = [
  {
    id: "j1_001", level: "中1", title: "My School Life", genre: "学校生活",
    passage: "Ken is a junior high school student. He likes English and music.\n\nHe studies English every morning. After school, he practices the guitar with his friends.\n\nSchool is busy, but Ken enjoys learning new things every day.",
    translation: "ケンは中学生です。英語と音楽が好きです。\n\n毎朝英語を勉強します。放課後は友達とギターを練習します。\n\n学校は忙しいですが、ケンは毎日新しいことを学ぶのを楽しんでいます。",
    notes: [["junior high school", "中学校"], ["practice", "練習する"]],
    theme: "学校生活", main: "ケンが学校で楽しく学んでいること", flow: "好きな教科、毎日の活動、学校への思い",
    facts: [
      ["What does Ken like?", "English and music", "He likes English and music.", "彼は英語と音楽が好きです。"],
      ["What does Ken practice after school?", "the guitar", "After school, he practices the guitar with his friends.", "放課後、彼は友達とギターを練習します。"],
      ["How does Ken feel about school?", "He enjoys it.", "Ken enjoys learning new things every day.", "ケンは毎日新しいことを学ぶのを楽しんでいます。"],
    ],
  },
  {
    id: "j1_002", level: "中1", title: "Our Basketball Team", genre: "部活動",
    passage: "Mika is on the school basketball team. The team practices on Tuesday and Friday.\n\nMika is not the tallest player, but she runs very fast. She always passes the ball to her teammates.\n\nThe team has an important game next Sunday. Mika wants to play well with everyone.",
    translation: "ミカは学校のバスケットボール部に入っています。チームは火曜日と金曜日に練習します。\n\nミカは一番背の高い選手ではありませんが、とても速く走ります。いつも仲間にボールをパスします。\n\n次の日曜日に大切な試合があります。ミカはみんなとよいプレーをしたいと思っています。",
    notes: [["team", "チーム"], ["teammate", "チームメート"]],
    theme: "部活動", main: "協力して試合に向かうミカの姿", flow: "チーム紹介、ミカの特徴、次の試合",
    facts: [
      ["When does the team practice?", "on Tuesday and Friday", "The team practices on Tuesday and Friday.", "チームは火曜日と金曜日に練習します。"],
      ["What does Mika always do?", "passes the ball", "She always passes the ball to her teammates.", "彼女はいつも仲間にボールをパスします。"],
      ["When is the important game?", "next Sunday", "The team has an important game next Sunday.", "チームは次の日曜日に大切な試合があります。"],
    ],
  },
  {
    id: "j1_003", level: "中1", title: "A Baker in the Future", genre: "将来の夢",
    passage: "Sota loves bread. His grandfather has a small bakery near the station.\n\nOn Saturdays, Sota helps at the bakery. He puts bread in bags and talks with customers.\n\nSota wants to be a baker in the future. He hopes to make bread that makes people smile.",
    translation: "ソウタはパンが大好きです。祖父は駅の近くに小さなパン屋を持っています。\n\n土曜日、ソウタはパン屋を手伝います。パンを袋に入れ、お客さんと話します。\n\nソウタは将来パン職人になりたいです。人を笑顔にするパンを作りたいと願っています。",
    notes: [["bakery", "パン屋"], ["customer", "客"]],
    theme: "将来の夢", main: "ソウタがパン職人を目指す理由", flow: "パンへの興味、店の手伝い、将来の夢",
    facts: [
      ["Where is the bakery?", "near the station", "His grandfather has a small bakery near the station.", "祖父は駅の近くに小さなパン屋を持っています。"],
      ["When does Sota help there?", "On Saturdays", "On Saturdays, Sota helps at the bakery.", "土曜日、ソウタはパン屋を手伝います。"],
      ["What does Sota want to be?", "a baker", "Sota wants to be a baker in the future.", "ソウタは将来パン職人になりたいです。"],
    ],
  },
  {
    id: "j1_004", level: "中1", title: "Lunch Around the World", genre: "異文化理解",
    passage: "Our class has a new student from India. Her name is Anika.\n\nOne day, Anika brought curry and flat bread for lunch. She told us that her family often eats them with their hands.\n\nWe shared our lunch stories. We learned that different food customs can make lunchtime more interesting.",
    translation: "クラスにインドから来た新しい生徒がいます。名前はアニカです。\n\nある日、アニカは昼食にカレーと平たいパンを持ってきました。家族はよくそれらを手で食べると教えてくれました。\n\n私たちは昼食の話を共有しました。異なる食文化が昼食時間をより面白くすることを学びました。",
    notes: [["flat bread", "平たいパン"], ["custom", "習慣"]],
    theme: "異文化理解", main: "食文化の違いを知る面白さ", flow: "転校生の紹介、昼食文化、学んだこと",
    facts: [
      ["Where is Anika from?", "India", "Our class has a new student from India.", "クラスにインドから来た新しい生徒がいます。"],
      ["What did Anika bring?", "curry and flat bread", "Anika brought curry and flat bread for lunch.", "アニカは昼食にカレーと平たいパンを持ってきました。"],
      ["What did the class learn?", "Different food customs are interesting.", "Different food customs can make lunchtime more interesting.", "異なる食文化が昼食時間をより面白くします。"],
    ],
  },
  {
    id: "j1_005", level: "中1", title: "The Lost Blue Bag", genre: "物語文",
    passage: "Yui found a blue bag under a park bench. There was a picture book inside it.\n\nShe waited near the bench. Soon, a little boy came with his father. The boy was looking for his bag.\n\nYui gave the bag to him. The boy smiled, and Yui felt very happy.",
    translation: "ユイは公園のベンチの下で青いかばんを見つけました。中には絵本がありました。\n\n彼女はベンチの近くで待ちました。すぐに小さな男の子が父親と来ました。男の子はかばんを探していました。\n\nユイは彼にかばんを渡しました。男の子は笑い、ユイはとてもうれしく感じました。",
    notes: [["bench", "ベンチ"], ["inside", "中に"]],
    theme: "物語文", main: "落とし物を返して喜ばれた出来事", flow: "かばんを発見、持ち主を待つ、返して喜ぶ",
    facts: [
      ["Where did Yui find the bag?", "under a park bench", "Yui found a blue bag under a park bench.", "ユイは公園のベンチの下で青いかばんを見つけました。"],
      ["What was inside the bag?", "a picture book", "There was a picture book inside it.", "中には絵本がありました。"],
      ["How did Yui feel at the end?", "very happy", "Yui felt very happy.", "ユイはとてもうれしく感じました。"],
    ],
  },
  {
    id: "j2_001", level: "中2", title: "Clean River Project", genre: "SDGs・環境",
    passage: "A river runs through Emi's town, but people sometimes leave plastic bottles near it. Emi's science class decided to study the problem.\n\nFirst, the students counted the trash in three places. Then they made posters and placed more recycling boxes near the river.\n\nA month later, the amount of trash was smaller. Emi learned that small local actions can protect nature.",
    translation: "エミの町には川が流れていますが、人々が近くにペットボトルを置いていくことがあります。理科のクラスはその問題を調べることにしました。\n\nまず3か所のごみを数えました。その後ポスターを作り、川の近くに回収箱を増やしました。\n\n1か月後、ごみの量は減りました。エミは地域の小さな行動が自然を守れると学びました。",
    notes: [["amount", "量"], ["protect", "守る"]],
    theme: "SDGs・環境", main: "地域で行動すれば川の環境を改善できること", flow: "問題発見、調査と行動、変化と学び",
    facts: [
      ["What did the students count?", "the trash", "The students counted the trash in three places.", "生徒たちは3か所のごみを数えました。"],
      ["Where did they place recycling boxes?", "near the river", "They placed more recycling boxes near the river.", "彼らは川の近くに回収箱を増やしました。"],
      ["What happened a month later?", "The amount of trash was smaller.", "A month later, the amount of trash was smaller.", "1か月後、ごみの量は減りました。"],
      ["What did Emi learn?", "Small local actions can protect nature.", "Small local actions can protect nature.", "地域の小さな行動が自然を守れます。"],
    ],
  },
  {
    id: "j2_002", level: "中2", title: "A Library for Everyone", genre: "地域社会",
    passage: "The town library was quiet, but few teenagers visited it. Riku and his friends wanted to change this.\n\nThey asked students what they needed. Many wanted a place to study together and books about hobbies. The library created a teen corner based on their ideas.\n\nNow more students visit after school. Riku realized that listening to people is the first step in improving a community.",
    translation: "町の図書館は静かでしたが、訪れる10代はわずかでした。リクと友達はこれを変えたいと思いました。\n\n生徒に必要なものを尋ねると、多くが一緒に勉強する場所と趣味の本を望んでいました。図書館は意見をもとに10代向けコーナーを作りました。\n\n今では放課後により多くの生徒が訪れます。リクは人の声を聞くことが地域改善の第一歩だと気づきました。",
    notes: [["based on", "〜に基づいて"], ["community", "地域社会"]],
    theme: "地域社会", main: "利用者の声を聞いて図書館を改善したこと", flow: "課題、ニーズ調査、改善と成果",
    facts: [
      ["Who visited the library only rarely?", "teenagers", "Few teenagers visited it.", "図書館を訪れる10代はわずかでした。"],
      ["What place did many students want?", "a place to study together", "Many wanted a place to study together.", "多くの生徒が一緒に勉強する場所を望みました。"],
      ["What did the library create?", "a teen corner", "The library created a teen corner based on their ideas.", "図書館は10代向けコーナーを作りました。"],
      ["What did Riku realize?", "Listening is the first step.", "Listening to people is the first step in improving a community.", "人の声を聞くことが地域改善の第一歩です。"],
    ],
  },
  {
    id: "j2_003", level: "中2", title: "Tablet Helpers", genre: "AI・ICT",
    passage: "Nao's school started using tablets in class. At first, some students had trouble opening files and sending homework.\n\nNao made short video guides with clear instructions. She also opened a help desk during lunch twice a week.\n\nSoon, students became more confident. Nao found that technology is most useful when people help one another use it.",
    translation: "ナオの学校は授業でタブレットを使い始めました。最初、ファイルを開いたり宿題を送ったりするのが難しい生徒がいました。\n\nナオは分かりやすい説明動画を作り、週2回昼休みに相談所を開きました。\n\nやがて生徒たちは自信を持ちました。技術は人々が使い方を助け合うとき最も役立つとナオは気づきました。",
    notes: [["instruction", "説明"], ["confident", "自信のある"]],
    theme: "AI・ICT", main: "助け合うことでICTを有効に使えること", flow: "導入時の困難、ナオの支援、変化と気づき",
    facts: [
      ["What did some students have trouble doing?", "opening files and sending homework", "Some students had trouble opening files and sending homework.", "ファイルを開き宿題を送るのが難しい生徒がいました。"],
      ["What did Nao make?", "short video guides", "Nao made short video guides with clear instructions.", "ナオは分かりやすい短い説明動画を作りました。"],
      ["How often was the help desk open?", "twice a week", "She opened a help desk during lunch twice a week.", "週2回昼休みに相談所を開きました。"],
      ["When is technology most useful?", "When people help one another.", "Technology is most useful when people help one another use it.", "技術は人々が使い方を助け合うとき最も役立ちます。"],
    ],
  },
  {
    id: "j2_004", level: "中2", title: "The New Team Captain", genre: "部活動",
    passage: "Haru became captain of the tennis team. He thought a captain had to give strong orders, so he spoke a lot during practice.\n\nHowever, the team did not improve. His coach told him to ask questions and listen. Haru began having short meetings after practice.\n\nThe players shared useful ideas, and the team grew stronger. Haru learned that a good leader does not always speak first.",
    translation: "ハルはテニス部の部長になりました。部長は強く指示すべきだと思い、練習中たくさん話しました。\n\nしかしチームは上達しませんでした。コーチは質問して聞くよう助言しました。ハルは練習後に短いミーティングを始めました。\n\n選手たちは役立つ意見を共有し、チームは強くなりました。よいリーダーがいつも最初に話すとは限らないと学びました。",
    notes: [["captain", "部長"], ["improve", "上達する"]],
    theme: "部活動", main: "よいリーダーには聞く力が必要なこと", flow: "部長就任と失敗、助言と変化、成長",
    facts: [
      ["What did Haru think a captain had to do?", "give strong orders", "He thought a captain had to give strong orders.", "部長は強く指示すべきだと考えました。"],
      ["Who told Haru to listen?", "his coach", "His coach told him to ask questions and listen.", "コーチが質問して聞くよう助言しました。"],
      ["When did Haru have meetings?", "after practice", "Haru began having short meetings after practice.", "ハルは練習後に短いミーティングを始めました。"],
      ["What did Haru learn?", "A good leader does not always speak first.", "A good leader does not always speak first.", "よいリーダーがいつも最初に話すとは限りません。"],
    ],
  },
  {
    id: "j2_005", level: "中2", title: "One More Chance", genre: "物語文",
    passage: "Aya had practiced for the speech contest for weeks. On the morning of the contest, she forgot the first line and became silent.\n\nShe took a deep breath and looked at her teacher. Her teacher smiled, so Aya started again from the beginning.\n\nThis time, she finished the speech. She did not win, but she was proud because she did not give up.",
    translation: "アヤは何週間もスピーチ大会の練習をしていました。当日の朝、最初の一文を忘れて黙ってしまいました。\n\n深呼吸して先生を見ると、先生がほほえんだので、最初からやり直しました。\n\n今度は最後まで話せました。優勝はしませんでしたが、諦めなかったことを誇りに思いました。",
    notes: [["contest", "大会"], ["proud", "誇りに思う"]],
    theme: "物語文", main: "失敗しても諦めず再挑戦する大切さ", flow: "失敗、励ましと再挑戦、達成感",
    facts: [
      ["What did Aya forget?", "the first line", "She forgot the first line and became silent.", "彼女は最初の一文を忘れて黙りました。"],
      ["What did Aya do before starting again?", "took a deep breath", "She took a deep breath and looked at her teacher.", "彼女は深呼吸して先生を見ました。"],
      ["Did Aya win the contest?", "No, she did not.", "She did not win.", "彼女は優勝しませんでした。"],
      ["Why was Aya proud?", "She did not give up.", "She was proud because she did not give up.", "諦めなかったので誇りに思いました。"],
    ],
  },
  {
    id: "j3_001", level: "中3", title: "Saving Food at School", genre: "SDGs・環境",
    passage: "Every day, a large amount of school lunch was thrown away at Yuna's school. She wondered why and surveyed 180 students.\n\nThe survey showed that portion size was the main reason. Yuna proposed two sizes and a table where unopened food could be shared safely. Teachers tested the plan for a month.\n\nFood waste fell by thirty percent. The project showed Yuna that reliable data can turn a simple question into an effective solution.",
    translation: "ユナの学校では毎日多くの給食が捨てられていました。疑問を持ったユナは180人に調査しました。\n\n主な理由は量だと分かり、2種類の量と未開封食品を安全に共有する台を提案しました。先生たちは1か月試しました。\n\n食品廃棄は30％減りました。信頼できるデータが単純な疑問を効果的な解決策に変えると学びました。",
    notes: [["portion", "一人分の量"], ["reliable", "信頼できる"]],
    theme: "SDGs・環境", main: "データに基づく工夫で食品廃棄を減らしたこと", flow: "疑問と調査、提案と実験、成果",
    facts: [
      ["How many students did Yuna survey?", "180 students", "She surveyed 180 students.", "彼女は180人の生徒に調査しました。"],
      ["What was the main reason for waste?", "portion size", "Portion size was the main reason.", "主な理由は一人分の量でした。"],
      ["How long did teachers test the plan?", "for a month", "Teachers tested the plan for a month.", "先生たちは計画を1か月試しました。"],
      ["How much did food waste fall?", "by thirty percent", "Food waste fell by thirty percent.", "食品廃棄は30％減りました。"],
      ["What did the project show Yuna?", "Data can lead to effective solutions.", "Reliable data can turn a simple question into an effective solution.", "信頼できるデータは疑問を効果的な解決策に変えられます。"],
    ],
  },
  {
    id: "j3_002", level: "中3", title: "Learning Beyond Words", genre: "異文化理解",
    passage: "During an exchange program in Canada, Kenta stayed with a family that valued direct opinions. At first, he often answered, “Anything is fine,” because he wanted to be polite.\n\nHis host sister explained that giving an opinion helped the family understand him. Kenta began saying what he preferred while also asking about other people's ideas.\n\nHe discovered that respect can be expressed differently across cultures. Communication improves when we notice those differences instead of judging them quickly.",
    translation: "カナダでの交流中、ケンタは率直な意見を大切にする家庭に滞在しました。礼儀正しくしたくて「何でもいい」と答えていました。\n\nホストシスターは意見を言う方が理解しやすいと説明しました。ケンタは好みを伝え、相手の考えも尋ね始めました。\n\n敬意の示し方は文化で異なると気づきました。違いをすぐ判断せず気づくことで意思疎通は改善します。",
    notes: [["direct", "率直な"], ["judge", "判断する"]],
    theme: "異文化理解", main: "文化による敬意の示し方の違いを理解すること", flow: "文化の違いで困る、説明を受け実践、学び",
    facts: [
      ["Where did Kenta join an exchange program?", "Canada", "During an exchange program in Canada, Kenta stayed with a family.", "ケンタはカナダの交流プログラムに参加しました。"],
      ["Why did he say, “Anything is fine”?", "He wanted to be polite.", "He wanted to be polite.", "彼は礼儀正しくしたいと思っていました。"],
      ["Who explained the family's view?", "his host sister", "His host sister explained that giving an opinion helped.", "ホストシスターが家族の考えを説明しました。"],
      ["What did Kenta begin doing?", "saying his preferences and asking others", "Kenta began saying what he preferred while also asking about other people's ideas.", "好みを伝え相手の考えも尋ね始めました。"],
      ["How can communication improve?", "By noticing cultural differences.", "Communication improves when we notice those differences.", "文化の違いに気づくと意思疎通が改善します。"],
    ],
  },
  {
    id: "j3_003", level: "中3", title: "AI and the School Newspaper", genre: "AI・ICT",
    passage: "The school newspaper team used an AI tool to suggest headlines. The tool produced ideas quickly, and the students were impressed.\n\nHowever, one headline included a fact that was not in the article. The team checked every suggestion and rewrote unclear expressions. They also added a note explaining how the tool had been used.\n\nThe experience taught them that AI can support creative work, but people remain responsible for accuracy and fairness.",
    translation: "新聞委員会は見出し案にAIを使いました。素早い提案に生徒は感心しました。\n\nしかし記事にない事実を含む見出しがありました。全提案を確認し、不明確な表現を書き直し、使い方の注記も加えました。\n\nAIは創作を支援できますが、正確さと公平さへの責任は人にあると学びました。",
    notes: [["headline", "見出し"], ["accuracy", "正確さ"]],
    theme: "AI・ICT", main: "AIを使っても人が正確さに責任を持つ必要があること", flow: "AI活用、誤りの発見と確認、教訓",
    facts: [
      ["What did the AI tool suggest?", "headlines", "The school newspaper team used an AI tool to suggest headlines.", "新聞委員会は見出し案にAIを使いました。"],
      ["What problem did one headline have?", "It included a fact not in the article.", "One headline included a fact that was not in the article.", "一つの見出しが記事にない事実を含みました。"],
      ["What did the team check?", "every suggestion", "The team checked every suggestion.", "チームはすべての提案を確認しました。"],
      ["What note did they add?", "how the tool had been used", "They added a note explaining how the tool had been used.", "AIをどう使ったか説明する注記を加えました。"],
      ["Who is responsible for accuracy?", "people", "People remain responsible for accuracy and fairness.", "正確さと公平さへの責任は人にあります。"],
    ],
  },
  {
    id: "j3_004", level: "中3", title: "Designing an Inclusive Park", genre: "地域社会",
    passage: "The city planned to rebuild an old park. A student group noticed that the first design had many stairs and little shade.\n\nThey interviewed parents, older residents, and wheelchair users. Based on these voices, they proposed wide paths, resting places, and playground equipment for children with different needs.\n\nThe city accepted several ideas. The students learned that public spaces become better when planning includes people who experience them differently.",
    translation: "市は古い公園の改修を計画しました。生徒グループは最初の設計に階段が多く日陰が少ないと気づきました。\n\n保護者、高齢者、車いす利用者に聞き取り、広い道、休憩場所、多様な子ども向け遊具を提案しました。\n\n市はいくつか採用しました。異なる経験を持つ人を計画に含めると公共空間がよくなると学びました。",
    notes: [["inclusive", "誰も排除しない"], ["resident", "住民"]],
    theme: "地域社会", main: "多様な人の声を取り入れた公園づくり", flow: "設計の問題発見、聞き取りと提案、採用と学び",
    facts: [
      ["What did the first design have?", "many stairs and little shade", "The first design had many stairs and little shade.", "最初の設計には階段が多く日陰が少なかったです。"],
      ["Who did the students interview?", "parents, older residents, and wheelchair users", "They interviewed parents, older residents, and wheelchair users.", "保護者、高齢者、車いす利用者に聞き取りました。"],
      ["What kind of paths did they propose?", "wide paths", "They proposed wide paths.", "広い道を提案しました。"],
      ["Did the city accept their ideas?", "Yes, several ideas.", "The city accepted several ideas.", "市はいくつかの案を採用しました。"],
      ["When do public spaces become better?", "When planning includes different people.", "Public spaces become better when planning includes people who experience them differently.", "異なる経験を持つ人を計画に含めると公共空間がよくなります。"],
    ],
  },
  {
    id: "j3_005", level: "中3", title: "The Photograph", genre: "物語文",
    passage: "While cleaning her grandmother's house, Mei found an old photograph of a young woman beside a bicycle. Her grandmother usually avoided talking about her youth.\n\nMei asked gently about the picture. Her grandmother explained that she had once traveled alone across the country, although her parents had opposed the plan.\n\nMei saw her quiet grandmother differently after that day. The photograph did more than preserve a moment; it opened a door to a story that had nearly disappeared.",
    translation: "祖母の家を掃除中、メイは自転車の横に立つ若い女性の古い写真を見つけました。祖母は若い頃の話を避けていました。\n\nメイがやさしく尋ねると、祖母は両親の反対にもかかわらず一人で国内を旅したと説明しました。\n\nメイは祖母を違って見るようになりました。写真は瞬間を残すだけでなく、消えかけた物語への扉を開きました。",
    notes: [["oppose", "反対する"], ["preserve", "保存する"]],
    theme: "物語文", main: "一枚の写真から祖母の知られざる過去を知る物語", flow: "写真を発見、祖母に質問、見方の変化",
    facts: [
      ["Where did Mei find the photograph?", "in her grandmother's house", "Mei found an old photograph while cleaning her grandmother's house.", "メイは祖母の家を掃除中に写真を見つけました。"],
      ["Who was beside a bicycle?", "a young woman", "The photograph showed a young woman beside a bicycle.", "写真には自転車の横の若い女性が写っていました。"],
      ["What had her grandmother done?", "traveled alone across the country", "She had once traveled alone across the country.", "祖母はかつて一人で国内を旅しました。"],
      ["Who had opposed the plan?", "her parents", "Her parents had opposed the plan.", "祖母の両親が計画に反対しました。"],
      ["What did the photograph open?", "a door to a story", "It opened a door to a story that had nearly disappeared.", "消えかけた物語への扉を開きました。"],
    ],
  },
  {
    id: "exam_001", level: "入試", title: "The Value of Repair", genre: "SDGs・環境",
    passage: "When electronic devices break, many people replace them immediately. This habit creates waste and requires new resources. A repair café in one city offers another choice.\n\nVolunteers with technical skills meet visitors once a month. Instead of simply fixing items, they explain each step so owners can learn. Some devices cannot be saved, but visitors can still discover why the devices failed.\n\nThe café measures success not only by the number of repaired objects but also by the knowledge shared. Its approach suggests that a sustainable society depends on changing both products and people's relationship with them.",
    translation: "電子機器が壊れると、多くの人はすぐに買い替えます。この習慣は廃棄物を生み、新しい資源を必要とします。ある市の修理カフェは別の選択肢を示しています。\n\n技術を持つボランティアが月1回、訪問者と会います。単に直すのではなく、持ち主が学べるよう各手順を説明します。直せない場合でも、なぜ機器が故障したのかを知ることができます。\n\nカフェは修理できた物の数だけでなく、共有された知識によっても成功を測ります。持続可能な社会には、製品だけでなく、人と製品との関係も変える必要があると示しています。",
    notes: [["resource", "資源"], ["sustainable", "持続可能な"]],
    theme: "SDGs・環境", main: "修理と知識共有が持続可能な社会につながること", flow: "廃棄問題、修理カフェの方法、成功の新しい尺度",
    facts: [
      ["How often do volunteers meet visitors?", "once a month", "Volunteers with technical skills meet visitors once a month.", "技術を持つボランティアは月1回訪問者と会います。"],
      ["Why do volunteers explain each step?", "so owners can learn", "They explain each step so owners can learn.", "持ち主が学べるよう各手順を説明します。"],
      ["What can visitors learn from items that cannot be saved?", "why the devices failed", "Visitors can still discover why the devices failed.", "訪問者はなぜ機器が故障したかを知ります。"],
      ["How does the café measure success?", "by repairs and knowledge shared", "The café measures success not only by the number of repaired objects but also by the knowledge shared.", "修理数だけでなく共有された知識でも成功を測ります。"],
      ["What does a sustainable society require?", "changing products and people's relationship with them", "A sustainable society depends on changing both products and people's relationship with them.", "持続可能な社会には製品と人との関係の両方を変える必要があります。"],
    ],
  },
  {
    id: "exam_002", level: "入試", title: "Choosing a Path", genre: "将来の夢",
    passage: "Mai wanted to become a doctor because everyone praised the idea. During a career week, however, she joined a workshop led by a medical illustrator who creates images for textbooks and hospitals.\n\nThe work combined science with art, two subjects Mai had always enjoyed. She worried that choosing an unfamiliar career might disappoint her family, so she interviewed the illustrator about training and employment.\n\nMai did not make a final decision that week. Yet she learned that exploring a career seriously is different from following an image of success created by others.",
    translation: "マイは、周囲の人がその考えをほめてくれるため、医師になりたいと思っていました。しかし職業週間に、教科書や病院で使う絵を制作する医学イラストレーターの講座に参加しました。\n\nその仕事は、マイが以前から好きだった理科と美術を組み合わせるものでした。あまり知られていない職業を選ぶと家族を失望させるかもしれないと心配し、必要な訓練や就職について質問しました。\n\nその週に最終決定はしませんでしたが、真剣に職業を探ることは、他人が作った成功のイメージに従うこととは違うと学びました。",
    notes: [["illustrator", "イラストレーター"], ["employment", "雇用"]],
    theme: "将来の夢", main: "他人の期待ではなく自分で職業を探究する大切さ", flow: "従来の夢、新しい職業との出会い、考え方の変化",
    facts: [
      ["Why did Mai want to become a doctor?", "because everyone praised the idea", "Mai wanted to become a doctor because everyone praised the idea.", "皆がその考えをほめたので医師を目指しました。"],
      ["Who led the workshop?", "a medical illustrator", "She joined a workshop led by a medical illustrator.", "医学イラストレーターが講座を担当しました。"],
      ["What two subjects did the work combine?", "science and art", "The work combined science with art.", "その仕事は理科と美術を組み合わせます。"],
      ["What did Mai ask about?", "training and employment", "She interviewed the illustrator about training and employment.", "研修と雇用について尋ねました。"],
      ["What did Mai learn?", "Career exploration differs from following others' image of success.", "Exploring a career seriously is different from following an image of success created by others.", "真剣な職業探究は他人の成功像に従うこととは違います。"],
    ],
  },
  {
    id: "exam_003", level: "入試", title: "When Maps Tell Stories", genre: "地域社会",
    passage: "A coastal town wanted visitors to notice places beyond its famous beach. Local students created a digital map featuring small shops, historic wells, and stories told by older residents.\n\nThey soon faced a problem: some stories could not be confirmed. Rather than deleting them, the students labeled them as local memories and added verified historical information beside them.\n\nThe map attracted visitors, but its greater value was bringing generations together. It showed that community history includes both documented facts and memories, as long as readers understand the difference.",
    translation: "海辺の町は、有名な浜辺以外の場所にも観光客の目を向けたいと考えました。地域の生徒たちは、小さな店、歴史ある井戸、高齢の住民が語った話を載せたデジタル地図を作りました。\n\nやがて、一部の話は事実かどうか確認できないという問題が生じました。生徒たちは削除するのではなく、「地域の記憶」と表示し、その隣に確認済みの歴史情報を加えました。\n\n地図は観光客を引き付けましたが、さらに大きな価値は世代を結び付けたことでした。読者が違いを理解していれば、記録された事実と人々の記憶の両方が地域の歴史になると示しました。",
    notes: [["feature", "取り上げる"], ["verified", "確認された"]],
    theme: "地域社会", main: "事実と記憶を区別しながら地域の物語を伝える価値", flow: "地図作成、確認困難への対応、地域への効果",
    facts: [
      ["What did the town want visitors to notice?", "places beyond its famous beach", "The town wanted visitors to notice places beyond its famous beach.", "有名な浜以外の場所にも注目してほしいと考えました。"],
      ["Who told stories for the map?", "older residents", "The map featured stories told by older residents.", "高齢の住民が地図のために話をしました。"],
      ["How were unconfirmed stories labeled?", "as local memories", "The students labeled them as local memories.", "生徒は未確認の話を地域の記憶と表示しました。"],
      ["What was the map's greater value?", "bringing generations together", "Its greater value was bringing generations together.", "より大きな価値は世代を結びつけたことです。"],
      ["What must readers understand?", "the difference between facts and memories", "Readers understand the difference between documented facts and memories.", "読者は記録された事実と記憶の違いを理解する必要があります。"],
    ],
  },
  {
    id: "exam_004", level: "入試", title: "The Limits of Translation Apps", genre: "AI・ICT",
    passage: "Translation apps allow travelers to communicate quickly, but speed can hide important limits. Expressions of humor, politeness, and emotion often depend on context that software cannot fully recognize.\n\nIn an international online project, students used an app for first drafts, then compared the results with their intended meanings. They found several sentences that were grammatically correct but sounded cold or demanding.\n\nThe students revised those messages together. They concluded that technology can build a bridge between languages, but human attention is needed to decide how others may feel when crossing it.",
    translation: "翻訳アプリは素早い意思疎通を可能にしますが、速さは限界を隠します。ユーモア、丁寧さ、感情は文脈に依存し、ソフトが完全には認識できません。\n\n国際オンライン企画で、生徒は下書きにアプリを使い意図と比較しました。文法的には正しくても冷たく命令的な文がありました。\n\n一緒に修正し、技術は言語間の橋を作れるが、渡る相手の気持ちを考えるには人の注意が必要だと結論づけました。",
    notes: [["context", "文脈"], ["demanding", "命令的な"]],
    theme: "AI・ICT", main: "翻訳技術には人間による文脈と感情の確認が必要なこと", flow: "翻訳アプリの利点と限界、比較実験、結論",
    facts: [
      ["What can speed hide?", "important limits", "Speed can hide important limits.", "速さは重要な限界を隠すことがあります。"],
      ["What does software not fully recognize?", "context", "Context that software cannot fully recognize.", "ソフトウェアは文脈を完全には認識できません。"],
      ["What did students use the app for?", "first drafts", "Students used an app for first drafts.", "生徒は最初の下書きにアプリを使いました。"],
      ["How did some correct sentences sound?", "cold or demanding", "They sounded cold or demanding.", "冷たく、または命令的に聞こえました。"],
      ["What is needed in addition to technology?", "human attention", "Human attention is needed to decide how others may feel.", "相手の気持ちを考えるには人間の注意が必要です。"],
    ],
  },
  {
    id: "exam_005", level: "入試", title: "A Seat by the Window", genre: "物語文",
    passage: "On a crowded train, Ren noticed an empty window seat beside an elderly man. Ren sat down and immediately opened his book, hoping not to be disturbed.\n\nA few minutes later, the man quietly pointed outside. A group of cranes was flying above the river. Ren had traveled this route for years but had never looked up at that place.\n\nThey spoke only briefly before the man left. For the rest of the journey, Ren kept his book closed. The unexpected conversation had reminded him that familiar scenes may still contain things we have not learned to see.",
    translation: "混んだ電車で、レンは高齢の男性の隣に空いている窓側の席を見つけました。邪魔されたくないと思い、座るとすぐに本を開きました。\n\n数分後、男性が静かに外を指しました。川の上を鶴の群れが飛んでいました。レンは何年もこの路線を利用していましたが、その場所で空を見上げたことはありませんでした。\n\n男性が降りるまで二人が話したのはわずかな時間でした。レンは残りの道のりで本を閉じたままにしました。思いがけない会話によって、見慣れた景色にも、まだ見方を知らないものがあると思い出したのです。",
    notes: [["crane", "鶴"], ["familiar", "見慣れた"]],
    theme: "物語文", main: "見慣れた日常にも新しい発見があること", flow: "電車で着席、男性が景色を示す、レンの見方の変化",
    facts: [
      ["Where was the empty seat?", "beside an elderly man", "An empty window seat was beside an elderly man.", "空いた窓側席は高齢男性の隣でした。"],
      ["Why did Ren open his book?", "he hoped not to be disturbed", "He opened his book, hoping not to be disturbed.", "邪魔されたくないと思って本を開きました。"],
      ["What was flying above the river?", "a group of cranes", "A group of cranes was flying above the river.", "鶴の群れが川の上を飛んでいました。"],
      ["How long had Ren traveled the route?", "for years", "Ren had traveled this route for years.", "レンは何年もこの路線を使っていました。"],
      ["Why did Ren keep his book closed?", "He began noticing the familiar scene.", "Familiar scenes may still contain things we have not learned to see.", "見慣れた景色にもまだ見えていないものがあると気づいたからです。"],
    ],
  },
];

for (const lesson of lessons) {
  if (gradedMaterialOverrides[lesson.id]) Object.assign(lesson, gradedMaterialOverrides[lesson.id]);
  if (schoolGradeOverrides[lesson.id]) Object.assign(lesson, schoolGradeOverrides[lesson.id]);
}

const themeDistractors = ["学校生活", "部活動", "将来の夢", "異文化理解", "SDGs・環境", "地域社会", "AI・ICT", "物語文"];

const uniqueChoices = (answer, pool) => {
  const choices = [answer, ...pool.filter((item) => item !== answer)].slice(0, 4);
  return choices;
};

const questionType = (question, answer = "") => {
  const lower = question.toLowerCase();
  if (/^what happened|what did .+ learn|what did .+ realize|what did .+ show|what does .+ require|what can .+ learn/.test(lower)) return "statement";
  if (lower.startsWith("when") && /^when /i.test(answer)) return "statement";
  if (lower.startsWith("when") || lower.startsWith("how often") || lower.startsWith("how long")) return "time";
  if (lower.startsWith("where")) return "place";
  if (lower.startsWith("who")) return "person";
  if (lower.startsWith("why")) return "reason";
  if (lower.startsWith("how many") || lower.startsWith("how much")) return "number";
  if (lower.startsWith("did") || lower.startsWith("is ") || lower.startsWith("was ") || lower.startsWith("were ")) return "yesno";
  return "detail";
};

const typeScore = (candidate, type) => {
  const value = candidate.toLowerCase();
  if (type === "time") return /^(on |in |at |for |by |every |once |twice |next |a month|a few)/.test(value) ? 4 : 0;
  if (type === "place") return /^(in |at |near |under |beside |above |behind |outside)/.test(value) ? 4 : 0;
  if (type === "person") return candidate.split(" ").length <= 5 ? 2 : 0;
  if (type === "reason") return /because|so |to |hop|want|learn|help|notice|begin/i.test(candidate) ? 4 : 0;
  if (type === "statement") return candidate.split(" ").length >= 4 ? 3 : 0;
  if (type === "number") return /\d|one|two|three|thirty|percent|month|week|year/i.test(candidate) ? 4 : 0;
  if (type === "yesno") return /^(yes|no)/i.test(candidate) ? 5 : 0;
  return candidate.split(" ").length <= 9 ? 2 : 0;
};

const makeCloseVariants = (answer) => {
  const replacements = [
    ["Tuesday and Friday", "Monday and Thursday"],
    ["Tuesday and Friday", "Wednesday and Friday"],
    ["next Sunday", "this Saturday"],
    ["On Saturdays", "On Sundays"],
    ["once a month", "twice a month"],
    ["twice a week", "once a week"],
    ["for a month", "for two weeks"],
    ["for years", "for a few months"],
    ["180 students", "120 students"],
    ["thirty percent", "twenty percent"],
    ["near the station", "near the school"],
    ["near the river", "inside the school"],
    ["under a park bench", "on a park bench"],
    ["beside an elderly man", "across from an elderly man"],
    ["Canada", "the United States"],
    ["India", "Japan"],
    ["No, she did not.", "Yes, she did."],
  ];
  const variants = replacements
    .filter(([source]) => answer.toLowerCase().includes(source.toLowerCase()))
    .map(([source, replacement]) => answer.replace(new RegExp(source, "i"), replacement));
  if (answer.includes(" and ")) {
    const [first, second] = answer.split(" and ");
    variants.push(first, second);
  }
  if (/^he |^she |^it |^they /i.test(answer) && !/\bnot\b/i.test(answer)) {
    const subject = answer.split(" ")[0];
    variants.push(`${subject} does not feel that way.`);
  }
  return variants;
};

const extractPassagePhrases = (passage) => {
  const sentences = passage.split(/(?<=[.!?])\s+|\n+/).filter(Boolean);
  const starters = new Set(["a", "an", "the", "his", "her", "their", "our", "some", "many", "more", "several"]);
  const stops = new Set([
    "is", "are", "was", "were", "has", "have", "had", "do", "does", "did",
    "likes", "studies", "practices", "enjoys", "wants", "hopes", "found", "waited",
    "came", "gave", "felt", "runs", "leave", "decided", "counted", "made", "placed",
    "showed", "proposed", "tested", "fell", "learned", "started", "became", "created",
    "opened", "used", "checked", "added", "noticed", "interviewed", "accepted",
    "in", "on", "at", "near", "under", "above", "beside", "with", "for", "from",
    "to", "of", "but", "and", "so", "because", "when", "while", "after", "before", "during",
  ]);
  const phrases = [];
  for (const sentence of sentences) {
    const words = sentence.replace(/[.,!?;:“”"'’()[\]]/g, "").split(/\s+/);
    for (let index = 0; index < words.length; index += 1) {
      if (!starters.has(words[index].toLowerCase())) continue;
      const phrase = [];
      for (let cursor = index; cursor < Math.min(words.length, index + 4); cursor += 1) {
        const word = words[cursor];
        if (cursor > index && stops.has(word.toLowerCase())) break;
        phrase.push(word);
      }
      if (phrase.length >= 2) phrases.push(phrase.join(" "));
    }
  }
  return phrases.filter((phrase, index, array) => array.indexOf(phrase) === index);
};

const buildReadingChoices = (fact, lesson, factIndex) => {
  const answer = fact[1];
  const curatedDistractors = gradedDistractors[lesson.id]?.[factIndex];
  if (curatedDistractors) return uniqueChoices(answer, curatedDistractors);
  const type = questionType(fact[0], answer);
  const questionWords = new Set(fact[0].toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/));
  const passagePhrases = extractPassagePhrases(lesson.passage)
    .filter((phrase) => phrase.toLowerCase() !== answer.toLowerCase())
    .filter((phrase) => !phrase.toLowerCase().split(/\s+/).every((word) => questionWords.has(word)))
    .sort((a, b) => Math.abs(a.split(" ").length - answer.split(" ").length) - Math.abs(b.split(" ").length - answer.split(" ").length));
  const otherDetails = lesson.facts
    .filter((otherFact) => otherFact !== fact)
    .flatMap((otherFact) => [otherFact[1], ...makeCloseVariants(otherFact[1])]);
  const sameTypeAnswers = lessons
    .filter((item) => item.level === lesson.level && item.id !== lesson.id)
    .flatMap((item) => item.facts)
    .filter((otherFact) => questionType(otherFact[0], otherFact[1]) === type)
    .map((otherFact) => otherFact[1]);
  const candidates = [
    ...makeCloseVariants(answer),
    ...(type === "detail" ? passagePhrases : []),
    ...otherDetails.filter((candidate) => typeScore(candidate, type) > 0),
    ...sameTypeAnswers,
    ...otherDetails,
  ]
    .filter((candidate) => candidate && candidate !== answer)
    .filter((candidate, index, array) => array.indexOf(candidate) === index)
    .sort((a, b) => typeScore(b, type) - typeScore(a, type));
  const fallbacks = type === "time"
    ? ["the next day", "every morning", "after school"]
    : type === "place"
      ? ["near the school", "inside the building", "beside the river"]
      : type === "reason"
        ? ["to help the other students", "because the plan was difficult", "to learn something new"]
        : type === "statement"
          ? ["The first plan worked without any changes.", "The problem became larger after the action.", "People learned nothing from the experience."]
        : type === "number"
          ? ["ten", "twenty", "fifty"]
          : type === "yesno"
            ? ["Yes, it did.", "No, it did not.", "It was not decided."]
            : ["the activity mentioned first", "the action taken after that", "the result described at the end"];
  return uniqueChoices(answer, [...candidates, ...fallbacks]);
};

const makeReadingQuestion = (fact, lesson, factIndex) => {
  const passage = lesson.passage;
  const sourceEvidence = findEvidence(passage, fact[2], fact[1]);
  const focus = questionFocus(fact[0]);
  return {
  type: "choice",
  question: fact[0],
  choices: buildReadingChoices(fact, lesson, factIndex),
  answer: fact[1],
  evidence: sourceEvidence,
  explanation: `この問題は${focus}を尋ねています。本文の「${sourceEvidence}」から、答えは「${fact[1]}」だと分かります。`,
  };
};

function questionFocus(question) {
  const lower = question.toLowerCase();
  if (lower.startsWith("who")) return "人物";
  if (lower.startsWith("where")) return "場所";
  if (lower.startsWith("when") || lower.startsWith("how often") || lower.startsWith("how long")) return "時・期間";
  if (lower.startsWith("how many") || lower.startsWith("how much")) return "数・量";
  if (lower.startsWith("why")) return "理由";
  if (lower.startsWith("how did") || lower.startsWith("how does")) return "方法や変化";
  return "本文中の具体的な内容";
}

const scanningStopWords = new Set([
  "what", "who", "where", "when", "why", "how", "which", "does", "do", "did", "is", "are", "was", "were",
  "has", "have", "had", "can", "could", "will", "would", "the", "a", "an", "to", "of", "in", "on", "at",
  "for", "from", "with", "and", "or", "but", "it", "its", "this", "that", "these", "those", "he", "she",
  "they", "his", "her", "their", "some", "students", "student", "many", "much", "often", "long",
]);

const scanningGenericWords = new Set([
  "class", "school", "team", "people", "person", "students", "student", "must", "first", "next",
  "use", "used", "make", "made", "learn", "learned", "want", "wanted", "say", "said", "says", "told",
]);

const materials = lessons.map((lesson) => {
  const notes = lesson.notes.map(([word, meaning]) => ({ word, meaning }));
  const sameGenreLessons = lessons.filter((item) => item.genre === lesson.genre && item.id !== lesson.id);
  const sameLevelLessons = lessons.filter((item) => item.level === lesson.level && item.id !== lesson.id);
  const mainDistractors = [...sameGenreLessons, ...sameLevelLessons].map((item) => item.main);
  const flowDistractors = [...sameGenreLessons, ...sameLevelLessons].map((item) => item.flow);
  const step5 = lesson.facts.map((fact, factIndex) => makeReadingQuestion(fact, lesson, factIndex));
  return {
    id: lesson.id,
    level: lesson.level,
    title: lesson.title,
    genre: lesson.genre,
    passage: lesson.passage,
    translation: lesson.translation,
    notes,
    step1: {
      question: "設問と注釈から考えると、この長文のテーマは何ですか？",
      choices: uniqueChoices(lesson.theme, themeDistractors),
      answer: lesson.theme,
      hints: ["注釈の語と設問に繰り返し出る内容を見よう。", `「${notes[0].word}」が関係するジャンルを考えよう。`],
    },
    step2: {
      question: "最初と最後の段落から、この英文が一番伝えたいことは何だと考えられますか？",
      choices: uniqueChoices(lesson.main, mainDistractors),
      answer: lesson.main,
      hints: ["最初の問題提起と最後の学びをつなげよう。", "最後の段落で筆者が強調している変化に注目しよう。"],
    },
    step3: {
      question: "STEP5の設問から、本文はどのような流れだと予想できますか？",
      choices: uniqueChoices(lesson.flow, flowDistractors),
      answer: lesson.flow,
      hints: ["設問を上から順に並べ、時間や話題の変化を見よう。", "最初の設問と最後の設問の違いに注目しよう。"],
    },
    step4: lesson.facts.map((fact) => {
      const sourceEvidence = findEvidence(lesson.passage, fact[2], fact[1]);
      const questionKeywords = extractQuestionKeywords(fact[0]);
      return {
      question: fact[0],
      questionKeywords,
      answerPatterns: scanningPatterns(fact[0], sourceEvidence, fact[1], lesson.passage),
      hints: [
        `質問文の「${questionKeywords.join(" / ")}」に注目しよう。`,
        "同じ語や、形が変わった語を本文から探そう。",
        "答えがありそうな場所へ導く単語・短い語句を選ぼう。",
      ],
      translationTarget: sourceEvidence,
      translation: fact[3],
      };
    }),
    step5,
  };
});

function cleanWord(word) {
  return word.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, "");
}

function wordStem(word) {
  const clean = cleanWord(word);
  const irregular = { used: "use", made: "make", said: "say", told: "tell", found: "find", won: "win", left: "leave", went: "go" };
  if (irregular[clean]) return irregular[clean];
  if (clean.endsWith("ies") && clean.length > 4) return `${clean.slice(0, -3)}y`;
  if (clean.endsWith("ing") && clean.length > 5) return clean.slice(0, -3);
  if (clean.endsWith("ed") && clean.length > 4) return clean.slice(0, -2);
  if (clean.endsWith("es") && clean.length > 4) return clean.slice(0, -2);
  if (clean.endsWith("s") && clean.length > 3) return clean.slice(0, -1);
  return clean;
}

function extractQuestionKeywords(question) {
  return question
    .split(/\s+/)
    .map(cleanWord)
    .filter((word) => (word === "ai" || word.length > 2) && !scanningStopWords.has(word))
    .slice(-3);
}

function scanningPatterns(question, evidence, answer, passage) {
  const sentences = passage.match(/[^.!?]+[.!?]+[”"']?|[^.!?]+$/g)?.map((sentence) => sentence.trim()).filter(Boolean) ?? [];
  const evidenceIndex = sentences.indexOf(evidence);
  const contextSentences = evidenceIndex >= 0
    ? sentences.slice(Math.max(0, evidenceIndex - 1), evidenceIndex + 2)
    : [evidence];
  const contextWordGroups = contextSentences.map((sentence) =>
    sentence.split(/\s+/).map((raw) => ({ raw: raw.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, ""), clean: cleanWord(raw) })),
  );
  const evidenceWords = evidence.split(/\s+/).map((raw) => ({ raw: raw.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, ""), clean: cleanWord(raw) }));
  const targetStems = new Set(
    [...extractQuestionKeywords(question), ...answer.split(/\s+/).map(cleanWord)]
      .filter((word) => word.length > 2 && !scanningStopWords.has(word))
      .map(wordStem),
  );
  const patterns = [];
  const normalizedEvidence = evidence.toLowerCase().replace(/[.,!?;:“”"'’()[\]]/g, "").replace(/\s+/g, " ").trim();
  const normalizedAnswer = answer.toLowerCase().replace(/[.,!?;:“”"'’()[\]]/g, "").replace(/\s+/g, " ").trim();
  if (normalizedAnswer.length > 2 && normalizedEvidence.includes(normalizedAnswer)) patterns.push(normalizedAnswer);

  contextWordGroups.forEach((contextWords) => {
    contextWords.forEach((word, index) => {
      if (!word.clean || scanningStopWords.has(word.clean) || !targetStems.has(wordStem(word.clean))) return;
      if (!scanningGenericWords.has(word.clean)) patterns.push(word.clean);
      const previous = contextWords[index - 1]?.clean;
      const next = contextWords[index + 1]?.clean;
      if (previous && !scanningStopWords.has(previous) && !scanningGenericWords.has(previous)) patterns.push(`${previous} ${word.clean}`);
      if (next && !scanningStopWords.has(next) && !scanningGenericWords.has(next)) patterns.push(`${word.clean} ${next}`);
    });
  });

  if (patterns.length < 3) {
    evidenceWords
      .map((word) => word.clean)
      .filter((word) => word.length >= 5 && !scanningStopWords.has(word) && !scanningGenericWords.has(word))
      .sort((a, b) => b.length - a.length)
      .slice(0, 4)
      .forEach((word) => patterns.push(word));
  }

  return [...new Set(patterns.filter(Boolean))].slice(0, 8);
}

function findEvidence(passage, proposedEvidence, answer) {
  const sentences = passage
    .replace(/\n+/g, " ")
    .match(/[^.!?]+[.!?]+[”"']?|[^.!?]+$/g)
    ?.map((sentence) => sentence.trim())
    .filter(Boolean);
  if (sentences.includes(proposedEvidence)) return proposedEvidence;
  const keyWords = `${proposedEvidence} ${answer}`
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !["the", "and", "that", "this", "they", "was", "were", "has", "had"].includes(word));
  return sentences
    .map((sentence) => {
      const normalized = sentence.toLowerCase().replace(/[^a-z0-9\s]/g, "");
      const score = keyWords.reduce((total, word) => total + (normalized.includes(word) ? 1 : 0), 0);
      return { sentence, score };
    })
    .sort((a, b) => b.score - a.score)[0].sentence;
}

await mkdir(new URL("../src/data/", import.meta.url), { recursive: true });
await writeFile(new URL("../src/data/materials.json", import.meta.url), `${JSON.stringify(materials, null, 2)}\n`);
console.log(`Generated ${materials.length} materials.`);
