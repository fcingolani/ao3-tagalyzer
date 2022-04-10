# ao3-tagalyzer

A tool that finds all the works in #ao3 with a specific tag and then counts and sums all the other tags used in those same works.

I've tested it on the "TOLKIEN J. R. R. - Works & Related Fandoms" tag. You can play around with the results in [this Datastudio report](https://datastudio.google.com/u/0/reporting/db4185ea-2a11-4bd3-881e-901f088ae0cb/page/zNDqC).

## Instructions

Quick and dirty explanation:

1. Clone and install dependencies.
2. Run with the tag works URL as an argument. e.g. "Tony Stark" tag URL is "https://archiveofourown.org/tags/Tony%20Stark/works", so:
  ``
    $ node ao3 https://archiveofourown.org/tags/Tony%20Stark/works
  ``
3. Aaaand wait. The script includes a exponential backoff as AO3 servers will throttle you.
4. After some minutes or hours depending on how many works are in the selected tag, you'll end up with a .json file in the folder with all the tag texts, types and appearance counts.

Then you can convert that JSON to CSV using a tool like [this one available online](https://www.convertcsv.com/json-to-csv.htm), or investigate the reasons on why there are at least 2 works with the tag "Totoro" that also include the tag "Non-Consensual Bondage".

If I had more time to invest (?) in this project, I would make it generate a CSV instead of a JSON file.
