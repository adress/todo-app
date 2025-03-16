export interface AuthResponse {
    access_token:  string;
    token_type:    string;
    refresh_token: string;
    expires_in:    number;
    scope:         string;
    id:            string;
    username:      string; 
    jti:           string;
}

export interface Usuario {
    uid:        string;
    username:   string;
    roles?:     string;
}

export interface Payload {
    user_name:   string;
    scope:       string[];
    id:          number;
    exp:         number;
    authorities: string[];
    jti:         string;
    client_id:   string;
    username:    string;
}