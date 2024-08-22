export interface LanguageContent {
    Header: {
        buy: string;
        yourBrowserDoesNotSupportVideos: string;
    };
    About: {
        aboutUs: string;
        drivenByQuality: string;
        paragraph1: string;
        paragraph2: string;
        paragraph3: string;
        explore: string;
    };
    Catalogue: {
        efficientToolsFeatured: string;
        historyShared: string;
        learnMore: string;
        post1: {
            title: string;
            desc: string;
        };
        post2: {
            title: string;
            desc: string;
        };
        post3: {
            title: string;
            desc: string;
        };
    };
    Contact: {
        contactUs: string;
        email: string;
        phoneNumber: string;
        content: string;
        send: string;
        goodMessage: string;
        errorMessage: string;
        warnMessage: string;
        emailMessage: string;
    };
    Footer: {
        toolsForEveryTask: string;
        contact: string;
        phone: string;
        email: string;
    };
    Location: {
        whereWeAre: string;
        address: string;
        contacts: string;
        lisbonPortugal: string;
    };
    Products: {
        whatWereUpTo: string;
        drillingAndFastening: string;
        cuttingTools: string;
        materialRemoval: string;
        seeMore: string;
    };
    Partners: {
        partners: string;
    };
}

export interface ContentObject {
    pt: LanguageContent;
    en: LanguageContent;
    es: LanguageContent;
}
