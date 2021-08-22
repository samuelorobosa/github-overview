/**
 *
 * @Created by Samuel Amagbakhen <amagbakhensamuel@gmail.com>
 * @date 7/07/21 00:41A.M
 */

let GithubProfileOverviewDataContainer = document.querySelector("#data-container");
let input = document.querySelector("input");
let spinner = document.querySelector('#spinner');

///receive data from input
input.addEventListener('keyup',function (e) {
    e.preventDefault();
    if (e.key === 'Enter' ) {
        let input = document.querySelector("input");
        GithubProfileOverviewDataContainer.innerHTML = "";
        if (input.value.length > 0) {
            getUserData(input.value).then((res) => {
                //Print User Basic Info
                showUserData(res);
            })
        }
        input.value = '';
    }
});

//Get User Data From API call
    async function getUserData (username){
        try {
            //Basic Info Call
            const userBasicInfoCall = await fetch(`https://api.github.com/users/${username}`);
            if (!userBasicInfoCall.ok) {
                throw new Error("Problem getting user");

            } else {

                let userBasicInfo = await userBasicInfoCall.json();

                //Repos Call
                const userRepoDataCall = await fetch(`https://api.github.com/users/${username}/repos?per_page=6&sort=created: asc`);
                let userRepoData = await userRepoDataCall.json();

                return{
                    userBasicInfo:userBasicInfo,
                    userRepoData:userRepoData
                }
            }

        }catch (err){
            swal("Ooops!!", `${err}`, "error");
        }
    }


///////Show Profile
let showUserData = (userData) =>{
    let html = `<div class="row">
                    <div class="text-end" id="GithubProfileOverviewPageProfilePictureWrapper">
                        <img src="${userData.userBasicInfo.avatar_url}" alt="profile_picture" id="GithubProfileOverviewPageProfilePicture" width="120px">
                    </div>
                </div>
                <div class="row">
                    <div class="col mt-3 text-center">
                    <h2 id="GithubProfileOverviewPageFullName">${userData.userBasicInfo.name}</h2>
                    <a target="_blank" href="https://github.com/${userData.userBasicInfo.login}" id="GithubProfileOverviewPageUserName">@${userData.userBasicInfo.login}</a>

                <div id="GithubProfileOverviewPageSubDetails" class="row">
                    <div id="GithubProfileOverviewPageSubDetails_location" class="col-sm text-sm-end">
                        <i class="fas fa-map-marker-alt"></i>
                        ${userData.userBasicInfo.location}
                    </div>

                    <div id="GithubProfileOverviewPageSubDetails_dateJoined" class="col-sm text-sm-start">
                        <i class="fas fa-table"></i>
                        Joined ${dateParser(userData.userBasicInfo.created_at)}
                    </div>
                </div>
            </div>
        </div>

        <div class="row text-center mt-3">
            <div class="col GitHubProfileOverviewMainCard my-2">
                <i class="fas fa-briefcase"></i> &nbsp;
               ${userData.userBasicInfo.public_repos} repositories
            </div>

            <div class="col GitHubProfileOverviewMainCard my-2">
                <i class="fas fa-users"></i> &nbsp;
               ${userData.userBasicInfo.followers} followers
            </div>

            <div class="col GitHubProfileOverviewMainCard my-2">
                <i class="fas fa-user-plus"></i> &nbsp;
                ${userData.userBasicInfo.following} following
            </div>

    </div>

     <h3 class="text-center mt-5">Latest Repos</h3>
     <div class="d-flex justify-content-between text-center mt-3 flex-wrap" id="GithubProfileOverviewPageRepoWrapper">
            ${printRepoHtml(userData)}
     </div>`

    GithubProfileOverviewDataContainer.insertAdjacentHTML('beforeend', html);
    GithubProfileOverviewDataContainer.classList.remove('d-none');
}


function dateParser(date){
   const options = { year: 'numeric', month: 'long', day: 'numeric' };
   let convertedDate = new Date(date);
    return stringifiedDate = convertedDate.toLocaleString("en-US",options);
}


function printRepoHtml(repoInfo){
    let repoHtml = '';
    if (repoInfo.userRepoData.length > 0) {
        for (let i = 0; i < repoInfo.userRepoData.length; i++) {
            repoHtml += `<a target="_blank" href="https://github.com/${repoInfo.userRepoData[i].full_name}" class="GitHubProfileOverviewRepoCard d-flex flex-column my-2 mx-2">
                        <div>
                            <h3 class="card-title"><i class="fas fa-bookmark"></i>&nbsp;${repoInfo.userRepoData[i].name}</h3><br>
                            <div class="d-flex justify-content-between">
                                <div class="">
                                    <i class="fas fa-star"></i>&nbsp;${repoInfo.userRepoData[i].stargazers_count}
                                    <i class="fas fa-code-branch"></i>&nbsp;${repoInfo.userRepoData[i].forks_count}
                                </div>
            
                                <div class="">
                                    ${repoInfo.userRepoData[i].size.toLocaleString()}&nbsp;KB
                                </div>
                                </div>
                            </div>
                        </a>`
        }
    } else {
        repoHtml = '<p> This user has no repositories</p>'
    }
        return repoHtml;
}
