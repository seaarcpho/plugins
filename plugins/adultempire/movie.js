module.exports = async (ctx) => {
  const { args, $moment, $axios, $cheerio, $log, movieName, $createImage } = ctx;

  const name = movieName
    .replace(/#/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  $log(`Scraping movie covers for '${name}', dry mode: ${args.dry || false}...`);

  const url = `https://www.adultempire.com/allsearch/search?q=${name}`;
  const html = (await $axios.get(url)).data;
  const $ = $cheerio.load(html);

  const firstResult = $(".boxcover").toArray()[0];
  const href = $(firstResult).attr("href");

  if (href) {
    const movieUrl = "https://adultempire.com" + href;
    const html = (await $axios.get(movieUrl)).data;
    const $ = $cheerio.load(html);

    const desc = $(".m-b-0.text-dark.synopsis").text();
    let release;

    $(".col-sm-4.m-b-2 li").each(function (i, elm) {
      const grabrvars = $(elm).text().split(":");
      if (grabrvars[0].includes("Released")) {
        release = $moment(grabrvars[1].trim().replace(" ", "-"), "MMM-DD-YYYY").valueOf();
      }
    });

    const studioName = $(`.title-rating-section .item-info > a`).eq(0).text().trim();

    const frontCover = $("#front-cover img").toArray()[0];
    const frontCoverSrc = $(frontCover).attr("src");
    const backCoverSrc = frontCoverSrc.replace("h.jpg", "bh.jpg");

    if (args.dry === true) {
      $log({
        movieUrl,
        frontCoverSrc,
        backCoverSrc,
        studioName,
        desc,
        release,
      });
    } else {
      const frontCoverImg = await $createImage(frontCoverSrc, `${movieName} (front cover)`);
      const backCoverImg = await $createImage(backCoverSrc, `${movieName} (back cover)`);

      return {
        frontCover: frontCoverImg,
        backCover: backCoverImg,
        description: desc,
        releaseDate: release,
        studio: studioName,
      };
    }
  }

  return {};
};
