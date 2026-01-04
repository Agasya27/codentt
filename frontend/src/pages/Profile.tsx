import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { isAuthenticated, clearAuth } from "@/lib/auth";
import { userApi, authApi, ProfileResponse, StatsResponse, ActivityResponse, SubmissionResponse } from "@/lib/api";
import { Edit2, Save, X, LogOut, Mail, Phone, LogOut as LogOutAll } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/landing/Navbar";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [activity, setActivity] = useState<ActivityResponse | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<ProfileResponse>>({});
  const [activityView, setActivityView] = useState<"year" | "month">("year");

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/auth/login");
      return;
    }
    loadData();
  }, [navigate, activityView]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileRes, statsRes, activityRes, submissionsRes] = await Promise.all([
        userApi.getProfile(),
        userApi.getStats(),
        userApi.getActivity(activityView === "year" ? 365 : 30),
        userApi.getSubmissions(10),
      ]);
      setProfile(profileRes.data);
      setStats(statsRes.data);
      setActivity(activityRes.data);
      setSubmissions(submissionsRes.data);
      setEditData(profileRes.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await userApi.updateProfile(editData);
      setProfile(response.data);
      setEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      clearAuth();
      navigate("/");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      clearAuth();
      navigate("/");
    }
  };

  const handleLogoutAll = async () => {
    try {
      await authApi.logoutAll();
      clearAuth();
      navigate("/");
      toast({
        title: "Logged out from all devices",
        description: "You have been successfully logged out from all devices.",
      });
    } catch (error: any) {
      clearAuth();
      navigate("/");
    }
  };

  const handleCtaClick = () => {
    // Navigate to DSA page or home
    navigate("/dsa");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar onCtaClick={handleCtaClick} />
        <div className="pt-24 flex items-center justify-center min-h-[calc(100vh-6rem)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };


  const totalProblems = stats?.totalSolved || 0;
  const easyPercentage = totalProblems > 0 ? ((stats?.easySolved || 0) / totalProblems) * 100 : 0;
  const mediumPercentage = totalProblems > 0 ? ((stats?.mediumSolved || 0) / totalProblems) * 100 : 0;
  const hardPercentage = totalProblems > 0 ? ((stats?.hardSolved || 0) / totalProblems) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar onCtaClick={handleCtaClick} />
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Profile</h1>
            <p className="text-muted-foreground mt-2">Manage your profile and view your statistics</p>
          </div>
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You will be logged out of this device. You can log back in anytime.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="bg-destructive/80">
                  <LogOutAll className="mr-2 h-4 w-4" />
                  Logout All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Logout from all devices?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will log you out from all devices where you are currently logged in. You will need to log in again on all devices.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogoutAll}>Logout All Devices</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Information Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Information</CardTitle>
                    <CardDescription>Your personal details and account information</CardDescription>
                  </div>
                  {!editing ? (
                    <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.profilePictureUrl} alt={profile.username} />
                    <AvatarFallback className="text-2xl">{getInitials(profile.fullName)}</AvatarFallback>
                  </Avatar>
                  {editing && (
                    <div className="flex-1">
                      <Label htmlFor="profilePicture">Profile Picture URL</Label>
                      <Input
                        id="profilePicture"
                        value={editData.profilePictureUrl || ""}
                        onChange={(e) => setEditData({ ...editData, profilePictureUrl: e.target.value })}
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                  )}
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Username</Label>
                    <Input value={profile.username} disabled className="bg-muted" />
                  </div>
                  <div>
                    <Label>Full Name {editing && "*"}</Label>
                    <Input
                      value={editing ? (editData.fullName || "") : profile.fullName}
                      onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                      disabled={!editing}
                    />
                  </div>
                  <div>
                    <Label>Email {editing && "*"}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="email"
                        value={editing ? (editData.email || "") : profile.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        disabled={!editing}
                      />
                      {profile.emailVerified && (
                        <Badge variant="outline" className="text-green-600">
                          <Mail className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Phone Number {editing && "*"}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={editing ? (editData.phoneNumber || "") : profile.phoneNumber}
                        onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                        disabled={!editing}
                      />
                      {profile.phoneVerified && (
                        <Badge variant="outline" className="text-green-600">
                          <Phone className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>Gender</Label>
                    {editing ? (
                      <Select
                        value={editData.gender || ""}
                        onValueChange={(value) => setEditData({ ...editData, gender: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input value={profile.gender || "Not specified"} disabled />
                    )}
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={editing ? (editData.dateOfBirth || "") : (profile.dateOfBirth || "")}
                      onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })}
                      disabled={!editing}
                    />
                  </div>
                  <div>
                    <Label>College / Organization</Label>
                    <Input
                      value={editing ? (editData.college || "") : (profile.college || "")}
                      onChange={(e) => setEditData({ ...editData, college: e.target.value })}
                      disabled={!editing}
                      placeholder="Enter your college or organization"
                    />
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Input
                      value={editing ? (editData.country || "") : (profile.country || "")}
                      onChange={(e) => setEditData({ ...editData, country: e.target.value })}
                      disabled={!editing}
                      placeholder="Enter your country"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Timezone</Label>
                    <Input
                      value={editing ? (editData.timezone || "") : (profile.timezone || "")}
                      onChange={(e) => setEditData({ ...editData, timezone: e.target.value })}
                      disabled={!editing}
                      placeholder="e.g., UTC, EST, PST"
                    />
                  </div>
                </div>

                {/* Account Info */}
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-muted-foreground">Account Created</Label>
                      <p className="font-medium">
                        {new Date(profile.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Role</Label>
                      <div className="flex gap-2">
                        {profile.roles.map((role) => (
                          <Badge key={role} variant="secondary">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Solving Activity</CardTitle>
                    <CardDescription>Your problem-solving activity over time</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={activityView === "year" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActivityView("year")}
                    >
                      Year
                    </Button>
                    <Button
                      variant={activityView === "month" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActivityView("month")}
                    >
                      Month
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {activity && activity.dailyActivities.length > 0 ? (
                  <TooltipProvider>
                    <div className="space-y-4">
                      <div className="grid grid-cols-7 gap-1">
                        {activity.dailyActivities
                          .slice(activityView === "year" ? -365 : -30)
                          .map((day, idx) => {
                            const intensity = Math.min(day.problemsSolved * 10, 100);
                            const total = day.problemsSolved;
                            return (
                              <Tooltip key={idx}>
                                <TooltipTrigger asChild>
                                  <div
                                    className="aspect-square rounded-sm cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                                    style={{
                                      backgroundColor: intensity > 0 ? `rgba(59, 130, 246, ${intensity / 100})` : "rgba(0,0,0,0.1)",
                                    }}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="space-y-1">
                                    <p className="font-semibold">{new Date(day.date).toLocaleDateString()}</p>
                                    <p className="text-sm">Total: {total} problems</p>
                                    {day.easyCount > 0 && (
                                      <p className="text-sm text-green-500">Easy: {day.easyCount}</p>
                                    )}
                                    {day.mediumCount > 0 && (
                                      <p className="text-sm text-yellow-500">Medium: {day.mediumCount}</p>
                                    )}
                                    {day.hardCount > 0 && (
                                      <p className="text-sm text-red-500">Hard: {day.hardCount}</p>
                                    )}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            );
                          })}
                      </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Less</span>
                      <div className="flex gap-1">
                        {[0, 25, 50, 75, 100].map((val) => (
                          <div
                            key={val}
                            className="w-3 h-3 rounded-sm"
                            style={{
                              backgroundColor: `rgba(59, 130, 246, ${val / 100})`,
                            }}
                          />
                        ))}
                      </div>
                      <span>More</span>
                    </div>
                    </div>
                  </TooltipProvider>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No activity data available</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Submissions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent problem submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {submissions.length > 0 ? (
                  <div className="space-y-3">
                    {submissions.map((submission) => (
                      <div
                        key={submission.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{submission.problemName}</p>
                            <Badge
                              variant={
                                submission.status === "ACCEPTED"
                                  ? "default"
                                  : submission.status === "WRONG_ANSWER"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {submission.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>{submission.language}</span>
                            <span>
                              {new Date(submission.submittedAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No submissions yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            {/* Statistics Card */}
            <Card>
              <CardHeader>
                <CardTitle>Coding Statistics</CardTitle>
                <CardDescription>Your problem-solving performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold">{stats?.totalSolved || 0}</div>
                  <div className="text-sm text-muted-foreground">Problems Solved</div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-600">Easy</span>
                      <span className="text-sm">{stats?.easySolved || 0}</span>
                    </div>
                    <Progress value={easyPercentage} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-yellow-600">Medium</span>
                      <span className="text-sm">{stats?.mediumSolved || 0}</span>
                    </div>
                    <Progress value={mediumPercentage} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-red-600">Hard</span>
                      <span className="text-sm">{stats?.hardSolved || 0}</span>
                    </div>
                    <Progress value={hardPercentage} className="h-2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats?.accuracy.toFixed(1) || 0}%</div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats?.currentStreak || 0}</div>
                    <div className="text-xs text-muted-foreground">Current Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{stats?.longestStreak || 0}</div>
                    <div className="text-xs text-muted-foreground">Longest Streak</div>
                  </div>
                  {stats?.globalRank && (
                    <div className="text-center">
                      <div className="text-2xl font-bold">#{stats.globalRank}</div>
                      <div className="text-xs text-muted-foreground">Global Rank</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

