const fs = require('fs');

const cheerio = require('cheerio');
const axios = require('axios');
const randomUseragent = require('random-useragent');
const backOff = require("exponential-backoff").backOff;

(async () => {

    const args = process.argv.slice(2)

    try {
        const tagWorksURL = args[0];

        let tagData = {};

        const firstPage = await axios.get(tagWorksURL);
        const $firstPage = cheerio.load(firstPage.data);

        const lastPageLink = $firstPage('.pagination li:nth-last-child(2)');
        let totalPages = 1;

        if (lastPageLink.length > 0) {
            totalPages = lastPageLink.first().text()
        }

        for(let pageNum = 1; pageNum <= totalPages; pageNum++){

            console.log(`Fetching page ${pageNum}/${totalPages}`)

            const response = await backOff(() => axios.get(tagWorksURL, {
                params: {
                    page: pageNum
                },
                headers: {
                    'User-Agent': randomUseragent.getRandom()
                }
            }), {
                startingDelay: 4000,
                retry: (e) => {
                    console.log(`An error has occured: ${e.message}. Retrying...`);
                    return true;
                }
            });

            const $worksPage = cheerio.load(response.data);
            const tags = $worksPage('ul.tags li');

            for (let tag of tags) {
                const $tag = $worksPage(tag)
                const tagText = $tag.text();
                const tagType = $tag.attr('class').split(' ', 2).shift();
                const tagID = `${tagType}:${tagText}`

                if (tagData[tagID]) {
                    tagData[tagID].count++;
                } else {
                    tagData[tagID] = {
                        text: tagText,
                        count: 1,
                        type: tagType,
                    };
                }

            }

            console.log(`Found ${tags.length} tags`)
        }

        let data = JSON.stringify(Object.values(tagData), null, 2);
        fs.writeFileSync(`${+ new Date()}.json`, data);
    } catch (e) {
        console.error(e);
    }

})();