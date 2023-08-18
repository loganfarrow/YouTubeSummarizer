// helper function to parse the title from a summary text
function parseTitle(summaryText) {
    // since the summary can be a little unpredictable, we check for a few different things that could signify end of title
    // we take the minimum of the indices of these things to get the end of the title
    const firstNewlineIndex = summaryText.indexOf('\n')
    const firstPeriodIndex = summaryText.indexOf('.')
    const nthWordIndex = getNthSpaceIndex(summaryText, 12) // gets first 11 words

    const titleEndIndex = Math.min(firstNewlineIndex, firstPeriodIndex, nthWordIndex)

    console.log(firstNewlineIndex, firstPeriodIndex, nthWordIndex)
    console.log('titleEndIndex: ' + titleEndIndex)

    const title = summaryText.slice(0, titleEndIndex + 1)

    return title
}

function getNthSpaceIndex(text, n) {
    let spaceCount = 0
    let index = 0
    while (spaceCount < n && index < text.length) {
        if (text[index] === ' ') {
            spaceCount++
        }
        index++
    }
    return index
}

module.exports = {
    parseTitle,
}

testSummary = `Excessive Spending on Cam Model Leads to Tragic Consequences. \n\nGrant Amato, a 29-year-old unemployed man from Florida, became addicted to online cam sites and ended up spending over $200,000 of his family's money on a single cam model named Sylvia. This included his father's life savings and a loan taken out on the family home. After his family discovered his actions, he was sent to rehab for online porn addiction.`