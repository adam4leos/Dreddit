export enum EDredditTypes {
    POST = 'post',
    COMMENT = 'comment',
}

export const dredditProtocol = {
    'protocol': 'http://dreddit.xyz/protocol',
    'types': {
        [EDredditTypes.POST]: {
            'schema': 'https://schema.org/SocialMediaPosting',
            'dataFormats': [
                'application/json'
            ]
        },
        [EDredditTypes.COMMENT]: {
            'schema': 'https://schema.org/Comment',
            'dataFormats': [
                'application/json'
            ]
        },
    },
    'structure': {
        'post': {
            '$actions': [
                {
                    'who': 'author',
                    'of': 'post',
                    'can': 'write'
                },
                {
                    'who': 'anyone',
                    'can': 'read'
                }
            ],
        }
    }
};