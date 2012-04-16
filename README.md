#cron2korean

##소개
**Cron 식을 한국어로 번역해 보여주는 유틸리티** 입니다.

Quartz의 Cron format을 지원합니다.

test/index.html 에서 크론식 번역 문법을 확일할 수 있습니다.

##사용방법
    <script src="../c2k/c2k.js"></script>
    <script>
    var result = C2K.toKorean("0 0 12 * * ?");
    </script>