<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    public function verify($id, $hash)
    {
        $user = User::where('id', $id)->first();

        if(!hash_equals((string) $hash, sha1($user->email))) {
            return response()->json([
                'message'=>'Invalid verification link.'
            ],418);
        }

        if($user->hasVerifiedEmail()) {
            return response()->json([
                'message'=>'Email is already verified.'
            ],200);
        }

        $user->markEmailAsVerified();
        event(new Verified($user));

        $user->is_active = 1;
        $user->save();

        return response()->json("Email successfully verified.", 200);
    }
}
