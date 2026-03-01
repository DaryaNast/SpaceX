export interface LaunchLinks {
    mission_patch_small: string | null;
    mission_patch: string | null;
}

export interface LaunchRocket {
    rocket_name: string;
}

export interface Launch {
    mission_name: string;
    details: string | null;
    links?: LaunchLinks;
    rocket?: LaunchRocket;
}