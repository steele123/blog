import {Mail} from "lucide-react";
import {json, LoaderArgs} from "@remix-run/cloudflare";
import {useLoaderData} from "@remix-run/react";
import {getGithubContributions, GithubCommitsResponse} from "~/lib/github";
import DiscordLogo from "~/components/discord-logo";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "~/components/tooltip";

export const loader = async ({ context }: LoaderArgs) => {
    const cache = (caches as any).default as Cache
    let response = await cache.match("https://api.github.com/graphql")
    if (!response) {
        response = await getGithubContributions({
            username: "steele123",
            token: context.GITHUB_TOKEN as string
        })
        const newResponse = new Response(response.body, response)
        newResponse.headers.set("Cache-Control", "public, max-age=3600")
        await cache.put("https://api.github.com/graphql", newResponse.clone())
    }

    if (!response.ok) {
        throw new Error("Failed to fetch github contributions")
    }

    const body = await response.json() as GithubCommitsResponse
    const calender = body.data.user.contributionsCollection.contributionCalendar
    const filtered = {
        total: calender.totalContributions,
        weeks: calender.weeks.map((week) => ({
            firstDay: week.firstDay,
            days: week.contributionDays.map((day) => ({
                contributionCount: day.contributionCount,
                date: day.date,
                color: day.color,
                weekday: day.weekday
            }))
        }))
    }
    return json(filtered, {
        headers: {
            "Cache-Control": "public, max-age=3600"
        }
    })
}

export default function _index() {
    const contributions = useLoaderData<typeof loader>();

    return (
        <div className="max-w-7xl mx-auto gap-5 flex p-5">
            <div className="flex flex-col gap-5 max-w-md">
                <img className="rounded-full" width={200} height={200} src="/steele.jpg"/>
                <div className="text-4xl font-bold">steele</div>
                <div className="flex flex-col gap-2 border-y py-5">
                    <div className="flex items-center text-sm gap-2">
                        <Mail width={20}/>
                        <a className="hover:text-blue-500 hover:underline" href="mailto:me@stele.me">me@stele.me</a>
                    </div>
                    <div className="flex items-center text-sm gap-2">
                        <DiscordLogo />
                        <div>
                            steele#7375
                        </div>
                    </div>
                </div>
                <div className="text-accents-5 font-medium">
                    I am a software engineer who loves building complicated yet simple things.
                </div>
            </div>
            <div className="flex flex-col gap-5">
                <div className="border rounded-2xl shadow-md p-5">
                    <div className="flex">
                        <div className="text-2xl font-semibold">Github Contributions</div>
                        <a className="ml-auto hover:border-foreground text-accents-5 hover:text-foreground border px-4 text-sm py-1 font-medium ease-in-out duration-300 rounded"
                           href="https://github.com/steele123">
                            Follow
                        </a>
                    </div>
                    <div className="text-accents-5 font-medium text-sm">{new Date(contributions.weeks[0].firstDay).toLocaleDateString()} &rarr; {new Date(contributions.weeks[contributions.weeks.length - 1].firstDay).toLocaleDateString()}</div>
                    <div className="flex flex-wrap gap-x-2 gap-y-7 py-5">
                        {contributions.weeks.map((week, index) => (
                            <div key={week.firstDay} className="flex flex-col gap-2">
                                {week.days.map((day) => (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipContent>{day.contributionCount} contributions on {new Date(day.date).toLocaleDateString()}</TooltipContent>
                                            <TooltipTrigger
                                                className="w-4 h-4 border rounded"
                                                style={{
                                                    backgroundColor: day.color,
                                                }}
                                                key={day.date}
                                            />
                                        </Tooltip>
                                    </TooltipProvider>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div
                        className="text-xs font-medium text-accents-5">{contributions.total} contributions
                        in the last year
                    </div>
                </div>
            </div>
        </div>
    );
}
