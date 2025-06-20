zeeschuimer.register_module(
    'X/Twitter (User Profiles)',
    'x.com',
    function (response, source_platform_url, source_url) {
        let domain = source_platform_url.split("/")[2].toLowerCase().replace(/^www\./, '');

        if (
            !["x.com"].includes(domain)
            || (
                // these are known API endpoints used to fetch tweets for the interface
                source_url.indexOf('UserByScreenName') < 0
            )
        ) {
            return [];
        }

        let data;
        let users = [];
        try {
            data = JSON.parse(response);
        } catch (SyntaxError) {
            return [];
        }
        
        const searchParams = new URLSearchParams(source_url.substring(source_url.indexOf("?")+1));
        console.log(searchParams);
        console.log(searchParams.get("variables"));
        const screen_name = JSON.parse(searchParams.get("variables"))["screen_name"];
        console.log(screen_name);
        
        console.log(data);
        
        if (data.hasOwnProperty("data")) {
            if ("user" in data["data"]) {
            
                let profile = data["data"]["user"]["result"]
            
                if (profile["__typename"] === "User") {
                    users.push({
                        id: screen_name,
                        status: "live",
                        profile: profile
                    });
                } else if (profile["__typename"] === "UserUnavailable") {
                    users.push({
                        id: screen_name,
                        status: profile["reason"].toLowerCase()
                    });
                }
            } else if (Object.keys(data["data"]).length === 0) {
                users.push({
                    id: screen_name,
                    status: "unknown"
                });
            }
        }

        return users;
    },
    'x-user-profiles'
);
